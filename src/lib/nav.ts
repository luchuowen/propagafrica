// Primary navigation model. Order and wording are fixed by the brand spec.
// Products is a simple link to the hub page — no mega-menu. The persistent
// "Request a Quotation" header CTA is separate from this list, rendered by
// Header.astro directly.
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products/' },
  { label: 'Tools', href: '/tools/' },
  { label: 'Field Notes', href: '/field-notes/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
];

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export function isActive(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return withTrailingSlash(currentPath).startsWith(withTrailingSlash(href));
}
