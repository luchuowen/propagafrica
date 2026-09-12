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
    `New quotation request (${docId})`,
    '',
    `Name: ${values.name}`,
    `Farm or company: ${values.farmOrCompany}`,
    `Email: ${values.email}`,
    `Phone: ${values.phone || '—'}`,
    `Country: ${values.country}`,
    `Crop: ${values.crop}`,
    `Stage: ${values.stage.join(', ') || '—'}`,
    `Annual volume: ${values.annualVolume || '—'}`,
    `Delivery point: ${values.deliveryPoint || '—'}`,
    '',
    values.notes || '(no further notes)',
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
      subject: `Quotation request — ${values.farmOrCompany}`,
      text: lines.join('\n'),
    }),
  });

  if (!response.ok) {
    throw new Error(`email provider responded ${response.status}`);
  }
}
