import { describe, it, expect } from 'vitest';
import { validateSubmission, checkAutomation } from '../src/validate';

const VALID_BODY = {
  name: 'Jane Wanjiru',
  farmOrCompany: 'Rift Valley Roses Ltd',
  email: 'jane@example.com',
  phone: '',
  country: 'Kenya',
  crop: 'Rose',
  stage: ['Graft', 'Root'],
  annualVolume: '480 000',
  deliveryPoint: 'Naivasha',
  notes: '',
};

describe('validateSubmission', () => {
  it('accepts a fully valid submission', () => {
    const result = validateSubmission(VALID_BODY);
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.values.stage).toEqual(['Graft', 'Root']);
  });

  it('rejects a missing required field', () => {
    const result = validateSubmission({ ...VALID_BODY, name: '' });
    expect(result.ok).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it('rejects an empty stage list', () => {
    const result = validateSubmission({ ...VALID_BODY, stage: [] });
    expect(result.ok).toBe(false);
    expect(result.errors.stage).toBeDefined();
  });

  it('rejects a stage value outside the fixed option list', () => {
    const result = validateSubmission({ ...VALID_BODY, stage: ['Not a real stage'] });
    expect(result.ok).toBe(false);
    expect(result.errors.stage).toBeDefined();
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

  it('accepts a single (non-array) stage value from a plain form POST', () => {
    const result = validateSubmission({ ...VALID_BODY, stage: 'Graft' });
    expect(result.ok).toBe(true);
    expect(result.values.stage).toEqual(['Graft']);
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
