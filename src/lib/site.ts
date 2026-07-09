export const SITE = {
  name: 'Archangel Frequencies',
  url: 'https://archangelfrequencies.com',
  tagline: 'The signs are already there. We help you decode them.',
  description:
    'Angel number meanings, numerology calculators, archangel guides, and the Frequency Code\u2122 \u2014 decode the numbers that keep appearing in your life.',
  social: {
    facebook: 'https://www.facebook.com/archangelfrequencies',
    instagram: 'https://www.instagram.com/archangelfrequencies',
  },
};

// The Systeme.io funnel — the conversion endpoint.
// After connecting the custom domain in Systeme.io, point this at
// https://go.archangelfrequencies.com (see README). Until then it can stay
// on the systeme.io URL; every CTA on the site routes through /reveal/.
export const REVEAL_PATH = '/reveal/';
export const REVEAL_URL =
  'https://archangelfrequencies.systeme.io/b5a797a5-08bf6cef-b295bcf9';

export const NAV = [
  { label: 'Angel Numbers', href: '/angel-numbers/' },
  { label: 'Numerology', href: '/numerology/' },
  { label: 'Archangels', href: '/archangels/' },
  { label: 'Frequency', href: '/frequency/' },
  { label: 'Manifestation', href: '/manifestation/' },
  { label: 'Calculators', href: '/calculators/' },
  { label: 'Reviews', href: '/reviews/' },
];

export const CTA_LINE = 'Your birthdate carries its own number. Reveal your Frequency Code.';
