// Generates src/data/catalog.json — the top 100 angel number pages.
// Content is composed from digit meaning banks so every page is unique and
// structurally complete. Entries are marked draft:true — replace copy with
// the 1,015-entry house catalog voice over time. Overrides below are richer
// hand-tuned entries for the highest-volume numbers.

import { writeFileSync } from 'node:fs';

const DIGITS = {
  0: { theme: 'beginnings', words: ['openness', 'potential', 'the blank page', 'a fresh cycle'],
    spirit: 'a cycle closing so a truer one can open. Zero is the pause before the first note, the space where nothing is decided yet and everything is possible',
    love: 'a clean slate. Old patterns lose their grip here, and the way you connect gets a genuine restart',
    money: 'a reset in how you earn and spend. The habits that built your current situation are up for review, and that review is the opportunity',
    action: 'Stop filling the silence. Let the empty space stay empty for a few days and notice what wants to enter it' },
  1: { theme: 'initiative', words: ['leadership', 'independence', 'a first step', 'self-trust'],
    spirit: 'the push to begin. One appears when a decision you have been circling is ready to be made, and made by you alone',
    love: 'honesty about what you actually want. Relationships shift when you stop editing yourself to keep the peace',
    money: 'a green light on the venture, offer, or ask you have been postponing. Momentum favors the one who moves first',
    action: 'Pick the smallest version of the thing you keep planning and do it within 48 hours' },
  2: { theme: 'partnership', words: ['balance', 'patience', 'cooperation', 'quiet trust'],
    spirit: 'trust in timing. Two shows up when the work is done and the waiting has begun, and it asks you not to force the door',
    love: 'listening over winning. The relationship in front of you grows through small, repeated acts of consideration',
    money: 'collaboration. The next gain comes through a partner, a team, or a deal, not a solo sprint',
    action: 'Reach out to one person you have been meaning to reconnect with, without an agenda' },
  3: { theme: 'expression', words: ['creativity', 'voice', 'visibility', 'play'],
    spirit: 'your voice wanting out. Three appears around unspoken ideas, unshared work, and words you have been swallowing',
    love: 'saying the thing. Affection unexpressed reads as absence; this number asks you to say it out loud',
    money: 'income tied to what you create or communicate. The idea you call "just a hobby" is watching you',
    action: 'Publish, send, or say one thing this week that you have been keeping private' },
  4: { theme: 'foundation', words: ['stability', 'discipline', 'structure', 'steady hands'],
    spirit: 'protection through order. Four is the frame of the house, the reminder that what you build carefully will hold',
    love: 'reliability as romance. Showing up on the ordinary days matters more here than any grand gesture',
    money: 'systems over sprints. Budgets, routines, and boring consistency are the actual instruction',
    action: 'Choose one area of chaos and give it a simple structure this week: a list, a schedule, a limit' },
  5: { theme: 'change', words: ['freedom', 'movement', 'adventure', 'the open road'],
    spirit: 'change arriving whether invited or not. Five asks you to loosen your grip so the turn does not throw you',
    love: 'freshness. A relationship in a rut needs new ground, and a new connection may arrive mid-transition',
    money: 'a shift in how you earn. A role, market, or model is changing; adaptability is the asset',
    action: 'Change one fixed routine on purpose this week and watch what it shakes loose' },
  6: { theme: 'home', words: ['care', 'responsibility', 'family', 'harmony'],
    spirit: 'the pull back toward what you are responsible for. Six centers on home, family, body, and the people in your care',
    love: 'devotion and repair. An imbalance at home wants tending, and tending it is the whole assignment',
    money: 'security for the household. Decisions here should be measured against the people they protect',
    action: 'Handle the one domestic or family matter you have been deferring. It is smaller than it looks' },
  7: { theme: 'inner knowing', words: ['wisdom', 'solitude', 'study', 'the quiet answer'],
    spirit: 'an answer that only arrives in quiet. Seven appears when the noise of other opinions has drowned your own knowing',
    love: 'depth over performance. The connection that matters is the one where you can be silent together',
    money: 'research before risk. Do not move on this decision until you understand it well enough to explain it simply',
    action: 'Take one hour alone, no inputs, and write down what you already know about your situation' },
  8: { theme: 'power', words: ['abundance', 'authority', 'harvest', 'cause and effect'],
    spirit: 'the harvest of what you have practiced. Eight is momentum returning on effort, in both directions',
    love: 'power balance. Notice who decides, who gives, and whether the exchange is actually even',
    money: 'the strongest material signal in the catalog. An increase is available, and it responds to bold, clean asks',
    action: 'Make the ask you have been rehearsing: the raise, the rate, the price, the offer' },
  9: { theme: 'completion', words: ['release', 'endings', 'compassion', 'the wide view'],
    spirit: 'an ending that is also a graduation. Nine appears at the close of a chapter you have outgrown',
    love: 'closure. Something needs to be finished kindly so something else can begin honestly',
    money: 'clearing. Debts, dead projects, and draining commitments are the things to finish first',
    action: 'Formally end one thing this week: unsubscribe, hand off, say goodbye, close the file' },
};

// Twin flame lines vary by pattern to avoid sameness.
const TWIN = {
  single: (d) => `As a single digit, this number points the twin flame journey inward. Whatever is happening with the other person, the current work is ${DIGITS[d].theme}: your side of the mirror moves first, and the connection follows the state you hold.`,
  double: (d) => `Doubled digits in twin flame readings speak to mirroring. What you notice in them right now, especially around ${DIGITS[d].words[0]}, is showing you something active in yourself. Separation and reunion questions both point back to that mirror.`,
  triple: (d) => `Triple repetition is traditionally read as an amplified twin flame signal. Themes of ${DIGITS[d].words[0]} and ${DIGITS[d].words[1]} are intensifying in the connection, and the number tends to appear near a stage change: contact, distance, or a shift in who is doing the pursuing.`,
  quad: (d) => `Four-digit repetition is the loudest form of this signal. In twin flame terms it marks a threshold: the ${DIGITS[d].theme} lesson of this connection is peaking, and how you respond in the next stretch sets the tone for the next stage.`,
  mixed: (a, b) => `In twin flame readings this blend pairs ${DIGITS[a].theme} with ${DIGITS[b].theme}. One of you carries the first energy, one the second, and the connection is asking those two currents to stop competing and start cooperating.`,
};

const BIBLE = {
  0: 'In scripture, the void before creation (Genesis 1:2) is not emptiness but readiness. Readers of faith often take repeated zeros as a reminder that God begins new things in still, unformed places.',
  1: 'One echoes the theme of first things: "Seek first the kingdom" (Matthew 6:33). For readers of faith, this number is often taken as a call to put the primary thing back in first place.',
  2: 'Two appears in scripture around agreement and witness: "Where two or three are gathered" (Matthew 18:20). Many readers take it as encouragement toward reconciliation and shared prayer.',
  3: 'Three is among the most significant biblical numbers: the Trinity, the third-day resurrection, threefold callings. Readers of faith often receive repeated threes as a sign of completeness and confirmed direction.',
  4: 'Four in scripture marks the created order: four corners of the earth, four winds, four rivers of Eden. It is commonly read as God bringing structure and provision to daily, material life.',
  5: 'Five is associated with grace in biblical numerology: five loaves feeding the multitude, David\u2019s five stones. Readers of faith often take it as grace covering a season of change.',
  6: 'Six is the number of humanity, created on the sixth day. In a faith reading it points to human responsibility: the work of caring for what has been entrusted to you.',
  7: 'Seven is the Bible\u2019s number of completion and rest, from the seventh day of creation onward. It is widely received as confirmation that a season is complete and rest is permitted.',
  8: 'Eight signals new beginnings in scripture: eight people carried through the flood, circumcision on the eighth day, resurrection on the "eighth day" of the week. It is often read as restoration after testing.',
  9: 'Nine carries the fruit of the Spirit (Galatians 5:22-23) and the ninth-hour prayer. Readers of faith often take it as a call to let character, not circumstance, lead the next decision.',
};

// Pattern helpers -----------------------------------------------------------
function digitsOf(n) { return n.split('').map(Number); }
function pattern(n) {
  const d = digitsOf(n);
  if (d.length === 1) return 'single';
  if (d.every((x) => x === d[0])) return d.length === 2 ? 'double' : d.length === 3 ? 'triple' : 'quad';
  const s = n.split('');
  if (s.join('') === [...s].reverse().join('') && d.length > 2) return 'mirror';
  if (d.every((x, i) => i === 0 || x === d[i - 1] + 1)) return 'sequence';
  return 'mixed';
}
function dominant(n) {
  const d = digitsOf(n);
  const counts = {};
  d.forEach((x) => (counts[x] = (counts[x] || 0) + 1));
  return Number(Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]);
}
function secondary(n) {
  const d = [...new Set(digitsOf(n))];
  const dom = dominant(n);
  return d.find((x) => x !== dom) ?? dom;
}
function reduceNum(n) {
  let s = digitsOf(n).reduce((a, b) => a + b, 0);
  while (s > 9 && s !== 11 && s !== 22 && s !== 33) s = String(s).split('').map(Number).reduce((a, b) => a + b, 0);
  return s;
}

// Top 100 list (by search demand pattern in this niche) ----------------------
const TOP100 = [
  '1111','444','222','333','555','777','111','888','999','666','000',
  '1212','1234','1010','1122','1221','1313','1414','1515','1616','1717','1818','1919','2121','2112','2222','3333','4444','5555','6666','7777','8888','9999','0000',
  '11','22','33','44','55','66','77','88','99','00',
  '1','2','3','4','5','6','7','8','9','0',
  '123','321','1001','1144','1133','1155','1244','1444','2020','2023','202','212','232','242','252','262','272','282','292',
  '311','411','511','611','711','811','911','611','233','244','133','144','155','166','177','188','199',
  '344','422','433','455','122','322','522','622','722','822','922','933','944','955','313','818','717','616',
];

// Hand-tuned overrides for the highest-volume numbers ------------------------
const OVERRIDES = {
  '1111': {
    tags: ['awakening', 'alignment', 'open gate'],
    intro: '1111 is the most searched number sequence in the world, and the reason is simple: it tends to appear at turning points. Four ones in a row read as a gate standing open. The thought you were holding the moment you saw it matters more than the clock did.',
  },
  '444': {
    tags: ['protection', 'steadiness', 'you are supported'],
    intro: '444 is the steadying number. It shows up in seasons of effort and doubt, and its message is consistent across traditions: the foundation you are building is stronger than it feels from inside the work. Keep going, and let the structure hold you.',
  },
  '222': {
    tags: ['trust', 'timing', 'partnership'],
    intro: '222 arrives in the gap between planting and harvest. It is the number of not yet, but surely: the situation you are worried about is developing correctly, and forcing it now would cost more than waiting will.',
  },
  '333': {
    tags: ['expression', 'growth', 'support nearby'],
    intro: '333 gathers around creative pressure: the book half-written, the conversation half-had, the idea half-shared. Triple threes say the support you need is already close, and the missing ingredient is your own voice.',
  },
  '555': {
    tags: ['change', 'release', 'movement'],
    intro: '555 is the announcement of change. It rarely appears when life is standing still. Something is turning, and the number asks you to ride the turn rather than brace against it.',
  },
  '777': {
    tags: ['wisdom', 'luck earned', 'inner knowing'],
    intro: '777 is quiet confirmation. It appears when you are closer to the answer than you think, and it favors study, solitude, and trust in your own read of the situation over the crowd\u2019s.',
  },
};

function famousCousins(n) {
  const dom = dominant(n);
  const fam = [String(dom), String(dom) + String(dom), String(dom).repeat(3), String(dom).repeat(4)]
    .filter((x) => x !== n && TOP100.includes(x));
  return fam;
}

function related(n) {
  const set = new Set(famousCousins(n));
  const idx = TOP100.indexOf(n);
  // nearest popular siblings
  [idx - 1, idx + 1, idx - 2, idx + 2].forEach((i) => {
    if (TOP100[i] && TOP100[i] !== n) set.add(TOP100[i]);
  });
  return [...set].slice(0, 5);
}

function entry(n) {
  const p = pattern(n);
  const dom = dominant(n);
  const sec = secondary(n);
  const red = reduceNum(n);
  const D = DIGITS[dom];
  const S = DIGITS[sec];
  const ov = OVERRIDES[n] || {};

  const patternLine = {
    single: `As a single digit, ${n} is the root form of this energy, undiluted.`,
    double: `The doubled digit strengthens the message: ${D.theme} is not a suggestion here, it is the assignment.`,
    triple: `Triple repetition is the classic angel number form. When a digit repeats three times, its meaning is considered amplified and time-sensitive.`,
    quad: `Four-fold repetition is the strongest form a repeating number takes. Whatever ${dom} means on its own, ${n} means it urgently.`,
    mirror: `${n} is a mirror sequence. Mirror numbers are read as reflections: the outer situation is showing you an inner one.`,
    sequence: `${n} is an ascending sequence, read as forward motion: steps stacking in order, each one enabling the next.`,
    mixed: `${n} blends the energy of ${dom} (${D.theme}) with ${sec} (${S.theme}), and the reading lives in how those two currents combine.`,
  }[p];

  const spiritual = `${ov.intro || `Seeing ${n} repeatedly is rarely random noise. The core of this number is ${dom}: ${D.spirit}.`} ${patternLine} ${p === 'mixed' || p === 'sequence' || p === 'mirror' ? `Beneath the surface, ${n} reduces to ${red}, adding an undercurrent of ${DIGITS[red > 9 ? reduceNum(String(red)) : red]?.theme ?? DIGITS[red % 10].theme}.` : `Numerologically, ${n} reduces to ${red}, which keeps the reading anchored in ${DIGITS[red > 9 ? red === 11 ? 1 : red === 22 ? 4 : 6 : red].theme}.`}`;

  const love = `In love, ${n} centers on ${D.words[0]}. ${D.love}.${sec !== dom ? ` The ${sec} influence adds ${S.words[0]}: ${S.love.split('.')[0].toLowerCase()}.` : ''} If you are single, this number tends to appear when your pattern in relationships is ready to change, not just your relationship status.`;

  const money = `For money and career, ${n} speaks to ${D.words[1] ?? D.words[0]}. ${D.money}.${sec !== dom ? ` With ${sec} in the mix, watch for ${S.theme} shaping the opportunity.` : ''} Numbers do not move bank accounts; decisions do. Treat this as timing information for a decision you already sense.`;

  const twin = p === 'mixed' || p === 'sequence' || p === 'mirror' ? TWIN.mixed(dom, sec) : TWIN[p](dom);

  const faith = BIBLE[dom];

  const action = `${D.action}. Then note where and when ${n} appears for the next two weeks: the context of a sighting usually carries more information than the sighting itself.`;

  const faqs = [
    { q: `What does ${n} mean spiritually?`, a: `${n} carries the core energy of ${dom}: ${D.theme}. ${D.spirit.split('.')[0]}. Its repetition pattern makes the message ${p === 'quad' ? 'urgent' : p === 'triple' ? 'amplified' : 'personal'}.` },
    { q: `Is ${n} a warning?`, a: `No. ${n} is generally read as guidance rather than warning. The closest it comes to caution is around ${D.words[2] ?? D.words[0]}: it asks for attention, not fear.` },
    { q: `What does ${n} mean in love?`, a: `${D.love.split('.')[0]}. For couples it points to ${D.words[0]}; for singles it marks a pattern ready to change.` },
    { q: `What should I do when I keep seeing ${n}?`, a: `${D.action.split('.')[0]}. Track when and where the number appears; the surrounding context usually holds the specific message.` },
  ];

  return {
    number: n,
    slug: n,
    title: `${n} Angel Number Meaning`,
    tags: ov.tags || [D.theme, D.words[0], D.words[1] ?? D.words[0]],
    pattern: p,
    coreDigit: dom,
    reduces: red,
    spiritual,
    love,
    money,
    twinFlame: twin,
    biblical: faith,
    action,
    faqs,
    related: related(n),
    draft: !OVERRIDES[n],
  };
}

const seen = new Set();
const catalog = TOP100.filter((n) => (seen.has(n) ? false : seen.add(n))).map(entry);
writeFileSync(new URL('../src/data/catalog.json', import.meta.url), JSON.stringify(catalog, null, 2));
console.log(`Wrote ${catalog.length} entries to src/data/catalog.json`);
