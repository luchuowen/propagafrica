import { describe, it, expect } from 'vitest';
import { NAV_ITEMS, isActive } from '../../src/lib/nav';

describe('primary navigation', () => {
  it('has the six items in the specified order and wording', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Home',
      'Products',
      'Tools',
      'Field Notes',
      'About',
      'Contact',
    ]);
  });

  it('links to the routes fixed by the new information architecture', () => {
    expect(NAV_ITEMS.map((item) => item.href)).toEqual([
      '/',
      '/products/',
      '/tools/',
      '/field-notes/',
      '/about/',
      '/contact/',
    ]);
  });

  it('marks a page and its descendants as active', () => {
    expect(isActive('/products/grafting-tubes/', '/products/')).toBe(true);
    expect(isActive('/products', '/products/')).toBe(true);
    expect(isActive('/tools/', '/products/')).toBe(false);
  });

  it('treats home specially so it does not match every path', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/products/', '/')).toBe(false);
  });
});
