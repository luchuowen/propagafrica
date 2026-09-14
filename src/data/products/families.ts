// The seven product families — blueprint.md Sections 2-9, flyer order.
// Single source of truth for the homepage teaser grid and the /products/
// hub: descriptor, tagline and tags are transcribed verbatim from the
// client's flyer and must not drift between the two pages that show them.
export interface ProductFamily {
  slug: string;
  name: string;
  /** Verbatim family tagline from its own page (Sections 3-9). */
  tagline: string;
  /** Verbatim family intro paragraph, reused as the one-paragraph descriptor. */
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
      'High-quality silicone tubes designed for rose and ornamental as well as vegetable and fruit tree grafting. Ensure optimal union, high graft success and healthy growth.',
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
    descriptor: 'Precision clips for strong graft unions and better propagation outcomes.',
    tags: ['Roses and ornamentals', 'Vegetables and cucurbits', 'Fruit trees'],
    img: '/images/products/grafting-clips/hero.jpg',
    keyBullets: ['U-Clip', 'Omega Clip', 'Round Clip', 'Tomato Clip'],
    href: '/products/grafting-clips/',
  },
  {
    slug: 'nursery-consumables',
    name: 'Nursery Consumables',
    tagline: 'Everything You Need for Healthy Propagation.',
    descriptor: 'Essential supplies for clean, efficient and productive nurseries.',
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
    descriptor: 'Integrated systems to improve efficiency, uniformity and yield.',
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
      'Disinfectants, sanitizers and hygiene solutions for a disease-free propagation environment.',
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
    descriptor: 'Digital tools to track, manage and improve your propagation results.',
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
    descriptor: 'From training to troubleshooting, we support your propagation journey.',
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
