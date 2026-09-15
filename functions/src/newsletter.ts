// Validation for the footer newsletter signup — a single email field, so this stays far
// smaller than validate.ts's per-field quotation logic. Anti-automation (honeypot + timing)
// is shared with the quotation path via checkAutomation() in validate.ts.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface NewsletterValidationResult {
  ok: boolean;
  email: string;
  error?: string;
}

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

export function validateNewsletterSubmission(
  body: Record<string, unknown>,
): NewsletterValidationResult {
  const email = asString(body.email).trim().slice(0, 254).toLowerCase();
  if (email.length === 0) {
    return { ok: false, email, error: 'Enter your email address.' };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, email, error: 'Enter a valid email address.' };
  }
  return { ok: true, email };
}
