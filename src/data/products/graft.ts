// Stage 02 · Graft — grafting sleeves and clips.
// Every field is copied verbatim from docs/content/copy-supplies.md; do not round or rephrase.

export interface GraftingSleeve {
  [key: string]: string;
  sku: string;
  bore: string;
  wall: string;
  length: string;
  crop: string;
  pack: string;
}

export const GRAFTING_SLEEVES: GraftingSleeve[] = [
  {
    sku: 'PRO-ROSE 35',
    bore: '3.5 mm',
    wall: '0.50 mm',
    length: '20 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-ROSE 45',
    bore: '4.5 mm',
    wall: '0.50 mm',
    length: '20 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-ROSE 55',
    bore: '5.5 mm',
    wall: '0.60 mm',
    length: '22 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-ROSE 65',
    bore: '6.5 mm',
    wall: '0.60 mm',
    length: '22 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-ROSE 75',
    bore: '7.5 mm',
    wall: '0.70 mm',
    length: '25 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-ROSE 85',
    bore: '8.5 mm',
    wall: '0.70 mm',
    length: '25 mm',
    crop: 'Rose and ornamental',
    pack: '50 000',
  },
  {
    sku: 'PRO-VEG',
    bore: '1.5–2.5 mm',
    wall: '0.40 mm',
    length: '15 mm',
    crop: 'Tomato, pepper, aubergine',
    pack: '100 000',
  },
  {
    sku: 'PRO-CUC',
    bore: '2.5–4.0 mm',
    wall: '0.45 mm',
    length: '18 mm',
    crop: 'Cucumber, melon, watermelon',
    pack: '100 000',
  },
  {
    sku: 'PRO-TREE',
    bore: '4.0–12 mm',
    wall: '0.70 mm',
    length: '30 mm',
    crop: 'Fruit tree',
    pack: '50 000',
  },
];

export interface GraftingClip {
  [key: string]: string;
  sku: string;
  profile: string;
  jaw: string;
  material: string;
  reusable: string;
  pack: string;
}

export const GRAFTING_CLIPS: GraftingClip[] = [
  {
    sku: 'PRO-CLIP U',
    profile: 'U',
    jaw: '1.5 · 2.0 · 2.5 · 3.0 mm',
    material: 'Silicone',
    reusable: 'No',
    pack: '1 000 · 5 000',
  },
  {
    sku: 'PRO-CLIP O',
    profile: 'Omega',
    jaw: '1.5 · 2.0 · 2.5 · 3.0 mm',
    material: 'Elastomer',
    reusable: 'No',
    pack: '1 000 · 5 000',
  },
  {
    sku: 'PRO-CLIP R',
    profile: 'Round',
    jaw: '2.0 · 2.5 · 3.0 mm',
    material: 'Thermoplastic',
    reusable: 'Yes',
    pack: '1 000 · 5 000',
  },
  {
    sku: 'PRO-CLIP T',
    profile: 'Tomato',
    jaw: '1.5 · 2.0 · 2.5 mm',
    material: 'Silicone',
    reusable: 'No',
    pack: '1 000 · 5 000',
  },
  {
    sku: 'PRO-CLIP V',
    profile: 'V',
    jaw: '2.0 · 2.5 · 3.0 mm',
    material: 'Thermoplastic',
    reusable: 'Yes',
    pack: '1 000 · 5 000',
  },
];
