// The two planning tools — blueprint.md Section 10. Single source of truth for
// the /tools/ hub cards and each calculator page's own heading, so the name
// and one-line description can't drift between the two places that show them.
export interface ToolSummary {
  slug: string;
  name: string;
  description: string;
  href: string;
  img: string;
  imgAlt: string;
}

export const TOOLS: readonly ToolSummary[] = [
  {
    slug: 'grafting-calculator',
    name: 'Grafting Sleeve and Clip Calculator',
    description: 'Work out tube and clip quantities for your next graft run.',
    href: '/tools/grafting-calculator/',
    img: '/images/products/grafting-tubes/hero.jpg',
    imgAlt: 'Silicone grafting tubes fitted over a rose graft union',
  },
  {
    slug: 'consumables-planner',
    name: 'Nursery Consumables Planner',
    description: 'Work out trays, pots, labels, domes and ties for your next propagation batch.',
    href: '/tools/consumables-planner/',
    img: '/images/products/nursery-consumables/hero.jpg',
    imgAlt: 'Propagation trays and nursery consumables ready for a new batch',
  },
];

// Shared disclaimer, blueprint.md Section 10 — verbatim, used on both tool
// pages and their result states.
export const TOOLS_DISCLAIMER =
  'These are planning estimates based on standard nursery ratios and a wastage allowance you can adjust. Contact our team to confirm exact quantities and packaging for your order.';
