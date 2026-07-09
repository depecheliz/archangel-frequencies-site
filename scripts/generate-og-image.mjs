// One-off generator for public/og-image.png — a branded placeholder OG image
// (1200x630, dark navy background + gold ring, matching public/favicon.svg).
// No image libraries are available in this environment, so this hand-rolls a
// minimal PNG encoder (RGB, filter-none scanlines, zlib deflate via Node's
// built-in zlib). Re-run with `node scripts/generate-og-image.mjs` if the
// brand palette in src/lib/site.ts / global.css ever changes.
import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const WIDTH = 1200;
const HEIGHT = 630;

const BG = [0x0b, 0x10, 0x26]; // --bg navy
const RING = [0xc9, 0xa2, 0x4b]; // --gold
const RING2 = [0xe3, 0xc8, 0x87]; // --gold-light

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// --- pixel buffer ---
const raw = Buffer.alloc(HEIGHT * (1 + WIDTH * 3));
const cx = WIDTH / 2;
const cy = HEIGHT / 2;
const outerR = 190;
const ringWidth = 7;
const innerAccentR = 150;

function setPixel(x, y, rgb) {
  const rowStart = y * (1 + WIDTH * 3);
  const off = rowStart + 1 + x * 3;
  raw[off] = rgb[0];
  raw[off + 1] = rgb[1];
  raw[off + 2] = rgb[2];
}

for (let y = 0; y < HEIGHT; y++) {
  raw[y * (1 + WIDTH * 3)] = 0; // filter type: none
  for (let x = 0; x < WIDTH; x++) {
    const dx = x - cx;
    const dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    let rgb = BG;
    if (Math.abs(d - outerR) < ringWidth) {
      rgb = RING;
    } else if (Math.abs(d - innerAccentR) < 2) {
      rgb = RING2;
    } else if (x < 4 || x >= WIDTH - 4 || y < 4 || y >= HEIGHT - 4) {
      rgb = RING; // thin gold frame
    }
    setPixel(x, y, rgb);
  }
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: RGB
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

const idat = deflateSync(raw, { level: 9 });

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', ihdr),
  chunk('IDAT', idat),
  chunk('IEND', Buffer.alloc(0)),
]);

writeFileSync(new URL('../public/og-image.png', import.meta.url), png);
console.log(`Wrote public/og-image.png (${png.length} bytes, ${WIDTH}x${HEIGHT})`);
