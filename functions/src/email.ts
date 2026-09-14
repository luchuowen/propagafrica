import { env } from './env';
import type { QuotationInput } from './validate';

// Sends the internal notification email for a new quotation request. Provider is chosen by the
// EMAIL_PROVIDER env var; only "resend" (a plain HTTPS API, no SDK dependency needed) is wired
// up today. Never throws — a failed notification must not lose an already-saved request; the
// caller logs and moves on.
export async function sendNotificationEmail(values: QuotationInput, docId: string): Promise<void> {
  if (env.emailProvider !== 'resend') {
    console.warn(
      `sendNotificationEmail: unsupported EMAIL_PROVIDER "${env.emailProvider}", skipping.`,
    );
    return;
  }
  if (!env.emailApiKey || !env.emailFrom || !env.emailTo) {
    console.warn('sendNotificationEmail: EMAIL_API_KEY, EMAIL_FROM or EMAIL_TO not set, skipping.');
    return;
  }

  const lines = [
    `New enquiry (${docId})`,
    '',
    `Name: ${values.name}`,
    `Company/farm name: ${values.farmOrCompany}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || '—'}`,
    `Country: ${values.country}`,
    `Enquiring about: ${values.enquiringAbout.join(', ') || '—'}`,
    '',
    values.message || '(no further message)',
    ...(values.calculatorContext ? ['', 'Calculator context:', values.calculatorContext] : []),
  ];

  const response = await fetch(`${env.emailApiBaseUrl}/emails`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.emailApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.emailFrom,
      to: [env.emailTo],
      reply_to: values.email,
      subject: `New enquiry — ${values.farmOrCompany}`,
      text: lines.join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`email provider responded ${response.status}`);
  }
}
