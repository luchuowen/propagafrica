// Stage 04 · Protect — nursery hygiene.
// Every field is copied verbatim from docs/content/copy-supplies.md; do not round or rephrase.

export interface HygieneDilution {
  [key: string]: string;
  application: string;
  target: string;
  concentratePer10L: string;
  contactTime: string;
}

export const PRO_SAN_DILUTIONS: HygieneDilution[] = [
  {
    application: 'Tool dip, between plants',
    target: '1 000 ppm',
    concentratePer10L: '83 ml',
    contactTime: '30 s or more',
  },
  {
    application: 'Footbath, refreshed daily',
    target: '1 000 ppm',
    concentratePer10L: '83 ml',
    contactTime: 'on entry',
  },
  {
    application: 'Bench and surface wash',
    target: '500 ppm',
    concentratePer10L: '42 ml',
    contactTime: '5 min or more',
  },
  {
    application: 'Irrigation line shock',
    target: '200 ppm',
    concentratePer10L: '17 ml',
    contactTime: '60 min or more',
  },
  {
    application: 'Empty-house terminal clean',
    target: '2 000 ppm',
    concentratePer10L: '167 ml',
    contactTime: '10 min or more',
  },
];

export interface HygieneProduct {
  [key: string]: string;
  sku: string;
  product: string;
  strength: string;
  pack: string;
}

export const HYGIENE_RANGE: HygieneProduct[] = [
  {
    sku: 'PRO-SAN 10',
    product: 'Sodium hypochlorite',
    strength: '10 % available chlorine, nominal',
    pack: '20 L',
  },
  {
    sku: 'PRO-SAN 12',
    product: 'Sodium hypochlorite',
    strength: '12 % available chlorine, nominal',
    pack: '20 L · 200 L',
  },
  {
    sku: 'PRO-FOOT',
    product: 'Footbath tray and grid',
    strength: '600 × 400 mm',
    pack: 'each',
  },
  {
    sku: 'PRO-DIP',
    product: 'Tool dip station',
    strength: '5 L',
    pack: 'each',
  },
  {
    sku: 'PRO-SPRAY 5',
    product: 'Knapsack sprayer',
    strength: '5 L',
    pack: 'each',
  },
  {
    sku: 'PRO-SPRAY 16',
    product: 'Knapsack sprayer',
    strength: '16 L',
    pack: 'each',
  },
  {
    sku: 'PRO-PPE',
    product: 'Gloves, aprons, overshoes, eye protection',
    strength: '—',
    pack: 'by pack',
  },
];
