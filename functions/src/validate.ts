import {
  QUOTATION_FIELDS,
  COUNTRY_OPTIONS,
  CROP_OPTIONS,
  STAGE_OPTIONS,
  MULTI_SELECT_MAX_ITEMS,
  HONEYPOT_FIELD,
  TIMESTAMP_FIELD,
  MIN_ELAPSED_MS,
  type QuotationFieldName,
} from './schema';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type QuotationInput = Omit<Record<QuotationFieldName, string>, 'stage'> & {
  stage: string[];
};

export interface ValidationResult {
  ok: boolean;
  values: QuotationInput;
  errors: Partial<Record<QuotationFieldName, string>>;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

// A multi-select field can arrive as a repeated form field (string[]), a single string, or be
// absent — normalise every shape to a trimmed, de-duplicated, capped string array.
function asStringArray(value: unknown, maxLength: number): string[] {
  const raw = Array.isArray(value) ? value : value === undefined || value === null ? [] : [value];
  const seen = new Set<string>();
  for (const item of raw) {
    if (typeof item !== 'string') continue;
    const trimmed = item.trim().slice(0, maxLength);
    if (trimmed) seen.add(trimmed);
  }
  return Array.from(seen).slice(0, MULTI_SELECT_MAX_ITEMS);
}

// Validates and length-caps every field server-side. Never trusts the client's own validation.
export function validateSubmission(body: Record<string, unknown>): ValidationResult {
  const values = { stage: [] } as unknown as QuotationInput;
  const errors: Partial<Record<QuotationFieldName, string>> = {};

  for (const field of QUOTATION_FIELDS) {
    if (field.type === 'multi-select') {
      const list = asStringArray(body[field.name], field.maxLength);
      values.stage = list;
      if (field.required && list.length === 0) {
        errors[field.name] = 'This field is required.';
        continue;
      }
      if (field.options && list.some((v) => !field.options?.includes(v))) {
        errors[field.name] = 'Select a valid option.';
      }
      continue;
    }

    const raw = asString(body[field.name]).trim().slice(0, field.maxLength);
    // Multi-select ("stage") already returned above, so `field.name` here is never 'stage' —
    // TS just can't correlate that with the discriminant on `field.type` at this point.
    values[field.name as Exclude<QuotationFieldName, 'stage'>] = raw;

    if (field.required && raw.length === 0) {
      errors[field.name] = 'This field is required.';
      continue;
    }
    if (raw.length === 0) continue;
    if (field.type === 'email' && !EMAIL_RE.test(raw)) {
      errors[field.name] = 'Enter a valid email address.';
    }
    if (field.type === 'select' && field.options && !field.options.includes(raw)) {
      errors[field.name] = 'Select a valid option.';
    }
  }

  // Belt-and-braces: re-check every enum field against its literal option set.
  if (values.country && !(COUNTRY_OPTIONS as readonly string[]).includes(values.country)) {
    errors.country = 'Select a valid option.';
  }
  if (values.crop && !(CROP_OPTIONS as readonly string[]).includes(values.crop)) {
    errors.crop = 'Select a valid option.';
  }
  if (values.stage.some((v) => !(STAGE_OPTIONS as readonly string[]).includes(v))) {
    errors.stage = 'Select a valid option.';
  }

  return { ok: Object.keys(errors).length === 0, values, errors };
}

export interface AutomationCheck {
  isAutomated: boolean;
  reason?: 'honeypot' | 'too-fast';
}

// Honeypot: any value at all means it's a bot (a human never sees or fills this field).
// Timestamp: absent (no JavaScript ran to stamp it) means "cannot check" — not a rejection,
// since the form must still work with JavaScript disabled. Present and too recent means a
// scripted client posted faster than a human could fill the form.
export function checkAutomation(body: Record<string, unknown>): AutomationCheck {
  const honeypot = asString(body[HONEYPOT_FIELD]).trim();
  if (honeypot.length > 0) return { isAutomated: true, reason: 'honeypot' };

  const rawTimestamp = asString(body[TIMESTAMP_FIELD]).trim();
  if (rawTimestamp.length === 0) return { isAutomated: false };

  const renderedAt = Number(rawTimestamp);
  if (!Number.isFinite(renderedAt)) return { isAutomated: false };

  const elapsed = Date.now() - renderedAt;
  if (elapsed >= 0 && elapsed < MIN_ELAPSED_MS) {
    return { isAutomated: true, reason: 'too-fast' };
  }
  return { isAutomated: false };
}
