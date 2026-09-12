// Central place reading process.env — every name here must also appear, documented, in the
// repo root .env.example (and its functions/.env.example mirror for local emulator use).
function readList(name: string): string[] {
  return (process.env[name] ?? '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export const env = {
  get emailProvider() {
    return process.env.EMAIL_PROVIDER ?? 'resend';
  },
  get emailApiKey() {
    return process.env.EMAIL_API_KEY ?? '';
  },
  get emailApiBaseUrl() {
    return process.env.EMAIL_API_BASE_URL ?? 'https://api.resend.com';
  },
  get emailFrom() {
    return process.env.EMAIL_FROM ?? '';
  },
  get emailTo() {
    return process.env.EMAIL_TO ?? '';
  },
  get allowedAdminEmails(): string[] {
    return readList('ALLOWED_ADMIN_EMAILS');
  },
  // Falls back to a fixed, non-secret string only so the emulator/tests run without setup.
  // Production deploys must set a real secret — see .factory/decisions/session-6.md.
  get rateLimitHashSalt() {
    return process.env.RATE_LIMIT_HASH_SALT ?? 'local-dev-salt-not-for-production';
  },
};
