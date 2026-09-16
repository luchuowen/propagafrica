// The seven product families — blueprint.md Sections 2-9, flyer order.
// Single source of truth for the homepage teaser grid and the /products/
// hub: descriptor, tagline and tags are transcribed verbatim from the
// client's flyer and must not drift between the two pages that show them.
export interface ProductFamily {
  slug: string;
  name: string;
  /** Verbatim family tagline from its own page (Sections 3-9). */
  tagline: string;
  /**
   * Card descriptor. Every fact in it is drawn from the family's own flyer
   * copy (intro, key products, specifications, packaging) in blueprint.md;
   * nothing here is new. It is deliberately not the verbatim intro: those run
   * 63 to 167 characters, which left the card grid ragged. These sit in a
   * 90-107 character band so every card reads as two lines. The verbatim
   * intro still opens each family's own page, untouched.
   */
  descriptor: string;
  /** Shop-by-crop filter tags (blueprint.md Section 2). */
  tags: string[];
  img: string;
  /** First 4 bullets of the family's own product/feature list, verbatim. */
  keyBullets: string[];
  /** Path to the family's own page, once built. */
  href: string;
}

export const CROP_ALL = 'All';
export const CROP_TAGS: readonly string[] = [
  'Roses and ornamentals',
  'Vegetables and cucurbits',
  'Fruit trees',
  'Nursery and facility supplies',
];

export const PRODUCT_FAMILIES: readonly ProductFamily[] = [
  {
    slug: 'grafting-tubes',
    name: 'Grafting Tubes',
    tagline: 'Flexible. Transparent. Reliable.',
    descriptor:
      'Medical-grade silicone tubes in 3.5mm to 8.5mm, for roses, ornamentals, vegetables and fruit trees.',
    tags: ['Roses and ornamentals', 'Vegetables and cucurbits', 'Fruit trees'],
    img: '/images/products/grafting-tubes/hero.jpg',
    keyBullets: [
      'PRO-ROSE 35 (3.5mm)',
      'PRO-ROSE 45 (4.5mm)',
      'PRO-ROSE 55 (5.5mm)',
      'PRO-ROSE 65 (6.5mm)',
    ],
    href: '/products/grafting-tubes/',
  },
  {
    slug: 'grafting-clips',
    name: 'Grafting Clips',
    tagline: 'Secure Unions. Higher Success.',
    descriptor:
      'Precision clips in five types, sized by stem diameter for strong unions on roses, vegetables and trees.',
    tags: ['Roses and ornamentals', 'Vegetables and cucurbits', 'Fruit trees'],
    img: '/images/products/grafting-clips/hero.jpg',
    keyBullets: ['U-Clip', 'Omega Clip', 'Round Clip', 'Tomato Clip'],
    href: '/products/grafting-clips/',
  },
  {
    slug: 'nursery-consumables',
    name: 'Nursery Consumables',
    tagline: 'Everything You Need for Healthy Propagation.',
    descriptor:
      'Trays, pots, labels, ties, domes and cutting tools for a clean, efficient and productive nursery.',
    tags: ['Nursery and facility supplies'],
    img: '/images/products/nursery-consumables/hero.jpg',
    keyBullets: [
      'Propagation trays and inserts',
      'Pots, polybags and sleeves',
      'Labels, tags and markers',
      'Ties, tapes and twist ties',
    ],
    href: '/products/nursery-consumables/',
  },
  {
    slug: 'propagation-systems',
    name: 'Propagation Systems',
    tagline: 'Efficient Systems. Better Results.',
    descriptor:
      'Misting, climate control, irrigation and benching, designed and installed for your site and crop.',
    tags: ['Nursery and facility supplies'],
    img: '/images/products/propagation-systems/hero.jpg',
    keyBullets: [
      'Misting and fogging systems',
      'Climate control solutions',
      'Heating and cooling systems',
      'Benching and racking systems',
    ],
    href: '/products/propagation-systems/',
  },
  {
    slug: 'sanitation',
    name: 'Sanitation Products',
    tagline: 'Clean Nurseries. Healthy Plants.',
    descriptor:
      'Disinfectants, footbaths, water treatment and PPE for a disease-free nursery, in 5L to 1,000L packs.',
    tags: ['Nursery and facility supplies'],
    img: '/images/products/sanitation/hero.jpg',
    keyBullets: [
      'Disinfectants and sanitizers',
      'Algae and biofilm control',
      'Surface and tool cleaners',
      'Footbaths and handwash solutions',
    ],
    href: '/products/sanitation/',
  },
  {
    slug: 'monitoring',
    name: 'Propagation Monitoring',
    tagline: 'Data-Driven Decisions. Better Outcomes.',
    descriptor:
      'Temperature, humidity, VPD and soil-moisture sensors on a dashboard you can check from a phone.',
    tags: ['Nursery and facility supplies'],
    img: '/images/products/monitoring/hero.jpg',
    keyBullets: [
      'Temperature, humidity and VPD sensors',
      'Soil moisture and EC monitoring',
      'Light intensity (PAR) sensors',
      'Data loggers and wireless systems',
    ],
    href: '/products/monitoring/',
  },
  {
    slug: 'technical-services',
    name: 'Technical Services',
    tagline: 'Expert Support. Lasting Success.',
    descriptor:
      'Training, nursery setup and design, crop protocols and troubleshooting, on-site or virtual.',
    tags: ['Nursery and facility supplies'],
    img: '/images/products/technical-services/hero.jpg',
    keyBullets: [
      'Propagation training and workshops',
      'On-site technical support',
      'Nursery setup and design',
      'Crop specific propagation protocols',
    ],
    href: '/products/technical-services/',
  },
];
