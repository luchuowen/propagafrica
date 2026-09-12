import { describe, it, expect } from 'vitest';
import { NAV_ITEMS, isActive } from '../../src/lib/nav';

describe('primary navigation', () => {
  it('has the five items in the specified order and wording', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'Supplies',
      'How grafting works',
      'Specifications',
      'Ordering',
      'Field Notes',
    ]);
  });

  it('marks a page and its descendants as active', () => {
    expect(isActive('/supplies/graft', '/supplies')).toBe(true);
    expect(isActive('/supplies', '/supplies')).toBe(true);
    expect(isActive('/ordering', '/supplies')).toBe(false);
  });

  it('treats home specially so it does not match every path', () => {
    expect(isActive('/', '/')).toBe(true);
    expect(isActive('/supplies', '/')).toBe(false);
  });
});
