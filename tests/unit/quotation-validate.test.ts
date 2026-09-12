import { describe, it, expect } from 'vitest';
import { validateField, validateMultiField } from '../../src/lib/quotation/validate';

describe('quotation form field validation', () => {
  it('requires the required text fields', () => {
    expect(validateField('name', '')).toBe('Enter your name.');
    expect(validateField('name', 'Jane Wanjiru')).toBeUndefined();
  });

  it('leaves optional fields alone when empty', () => {
    expect(validateField('phone', '')).toBeUndefined();
  });

  it('rejects a malformed email address', () => {
    expect(validateField('email', 'not-an-email')).toBe('Enter a valid email address.');
    expect(validateField('email', 'jane@example.com')).toBeUndefined();
  });

  it('rejects a select value outside its option list', () => {
    expect(validateField('country', 'Narnia')).toBe('Select a country.');
    expect(validateField('country', 'Kenya')).toBeUndefined();
  });

  it('caps field length', () => {
    expect(validateField('name', 'a'.repeat(200))).toMatch(/under 120 characters/);
  });

  it('requires at least one stage', () => {
    expect(validateMultiField('stage', [])).toBe('Select at least one stage.');
    expect(validateMultiField('stage', ['Graft'])).toBeUndefined();
  });

  it('rejects a stage value outside its option list', () => {
    expect(validateMultiField('stage', ['Not a stage'])).toBe('Select at least one stage.');
  });
});
