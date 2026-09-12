// Pure validation helpers for the quotation form, used client-side for inline errors.
// The server (functions/src/validate.ts) re-validates everything independently and does not
// trust these results — this copy exists only to give the browser fast, accessible feedback.
import { QUOTATION_FIELDS, MULTI_SELECT_MAX_ITEMS, type QuotationFieldName } from './schema';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateField(name: QuotationFieldName, rawValue: string): string | undefined {
  const field = QUOTATION_FIELDS.find((f) => f.name === name);
  if (!field) return undefined;
  const value = rawValue.trim();

  if (field.required && value.length === 0) {
    return field.requiredMessage ?? 'This field is required.';
  }
  if (value.length === 0) return undefined;
  if (value.length > field.maxLength) {
    return `Keep this under ${field.maxLength} characters.`;
  }
  if (field.type === 'email' && !EMAIL_RE.test(value)) {
    return field.invalidMessage ?? 'Enter a valid email address.';
  }
  if (field.type === 'select' && field.options && !field.options.includes(value)) {
    return field.requiredMessage ?? 'Select a valid option.';
  }
  return undefined;
}

// Multi-select fields ("stage") validate as a list of values rather than a single string.
export function validateMultiField(
  name: QuotationFieldName,
  rawValues: readonly string[],
): string | undefined {
  const field = QUOTATION_FIELDS.find((f) => f.name === name);
  if (!field) return undefined;
  const values = rawValues.map((v) => v.trim()).filter(Boolean);

  if (field.required && values.length === 0) {
    return field.requiredMessage ?? 'Select at least one option.';
  }
  if (values.length > MULTI_SELECT_MAX_ITEMS) {
    return `Select up to ${MULTI_SELECT_MAX_ITEMS} options.`;
  }
  if (field.options && values.some((v) => !field.options?.includes(v))) {
    return field.requiredMessage ?? 'Select a valid option.';
  }
  return undefined;
}
