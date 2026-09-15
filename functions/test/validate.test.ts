import { describe, it, expect } from 'vitest';
import { validateSubmission, checkAutomation } from '../src/validate';

const VALID_BODY = {
  name: 'Jane Wanjiru',
  farmOrCompany: 'Rift Valley Roses Ltd',
  email: 'jane@example.com',
  phone: '',
  country: 'Kenya',
  enquiringAbout: ['Grafting Tubes', 'Grafting Clips'],
  message: '',
};

describe('validateSubmission', () => {
  it('accepts a fully valid submission', () => {
    const result = validateSubmission(VALID_BODY);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.values.enquiringAbout).toEqual(['Grafting Tubes', 'Grafting Clips']);
  });

  it('rejects a missing required field', () => {
    const result = validateSubmission({ ...VALID_BODY, name: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejects an empty enquiringAbout list', () => {
    const result = validateSubmission({ ...VALID_BODY, enquiringAbout: [] });
    expect(result.ok).toBe(false);
    expect(result.errors.enquiringAbout).toBeDefined();
  });

  it('rejects an enquiringAbout value outside the fixed option list', () => {
    const result = validateSubmission({ ...VALID_BODY, enquiringAbout: ['Not a real product'] });
    expect(result.ok).toBe(false);
    expect(result.errors.enquiringAbout).toBeDefined();
  });

  it('rejects a malformed email address', () => {
    const result = validateSubmission({ ...VALID_BODY, email: 'not-an-email' });
    expect(result.ok).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it('length-caps every field regardless of what the client sent', () => {
    const result = validateSubmission({ ...VALID_BODY, name: 'a'.repeat(500) });
    expect(result.values.name).toHaveLength(120);
  });

  it('accepts a single (non-array) enquiringAbout value from a plain form POST', () => {
    const result = validateSubmission({ ...VALID_BODY, enquiringAbout: 'Grafting Tubes' });
    expect(result.ok).toBe(true);
    expect(result.values.enquiringAbout).toEqual(['Grafting Tubes']);
  });

  it('carries an optional calculator context through, length-capped', () => {
    const result = validateSubmission({ ...VALID_BODY, calculatorContext: 'a'.repeat(5000) });
    expect(result.ok).toBe(true);
    expect(result.values.calculatorContext).toHaveLength(4000);
  });
});

describe('checkAutomation', () => {
  it('flags a filled honeypot', () => {
    expect(checkAutomation({ companyWebsite: 'https://spam.example' }).isAutomated).toBe(true);
  });

  it('does not flag a genuinely empty honeypot', () => {
    expect(checkAutomation({ companyWebsite: '' }).isAutomated).toBe(false);
  });

  it('flags a submission timestamped under 2 seconds ago', () => {
    const result = checkAutomation({ renderedAt: String(Date.now() - 500) });
    expect(result.isAutomated).toBe(true);
    expect(result.reason).toBe('too-fast');
  });

  it('allows a submission timestamped more than 2 seconds ago', () => {
    const result = checkAutomation({ renderedAt: String(Date.now() - 5000) });
    expect(result.isAutomated).toBe(false);
  });

  it('does not reject a missing timestamp — a no-JavaScript submission never sets one', () => {
    expect(checkAutomation({}).isAutomated).toBe(false);
  });
});
