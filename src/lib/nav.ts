// Primary navigation model. Order and wording are fixed by the brand spec.
export interface NavItem {
  label: string;
  href: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Supplies', href: '/supplies' },
  { label: 'How grafting works', href: '/how-grafting-works' },
  { label: 'Specifications', href: '/specifications' },
  { label: 'Ordering', href: '/ordering' },
  { label: 'Field Notes', href: '/field-notes' },
];

export function isActive(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
