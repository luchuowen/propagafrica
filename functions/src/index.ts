import { setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { validateSubmission, checkAutomation } from './validate';
import { consumeRateLimit } from './rateLimit';
import { sendNotificationEmail } from './email';
import { sha256Hex } from './hash';
import { renderSuccessPage, renderErrorPage } from './render';
import { env } from './env';
import { makeListQuotations } from './admin';

// eur3 (the Firestore multi-region) spans europe-west1/europe-west4 — europe-west1 is the
// function region so writes land next to the data. See .factory/decisions/session-6.md.
setGlobalOptions({ region: 'europe-west1' });

initializeApp();
const db = getFirestore();

// Error copy: not specified by blueprint.md Section 13, this session's own addition.
const GENERIC_ERROR =
  'Check your connection and try again, or email info@propagafrica.com directly.';
const RATE_LIMIT_ERROR =
  'Too many requests from this connection. Try again in an hour, or email info@propagafrica.com directly.';

function wantsJson(req: { get(name: string): string | undefined }): boolean {
  const accept = req.get('Accept') ?? '';
  const contentType = req.get('Content-Type') ?? '';
  return accept.includes('application/json') || contentType.includes('application/json');
}

export const submitQuotation = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const asJson = wantsJson(req);

  const automation = checkAutomation(body);
  if (automation.isAutomated) {
    // Reject without hinting which signal tripped.
    if (asJson) {
      res.status(400).json({ ok: false, message: GENERIC_ERROR });
    } else {
      res.status(400).send(renderErrorPage(GENERIC_ERROR));
    }
    return;
  }

  const { ok, values, errors } = validateSubmission(body);
  if (!ok) {
    if (asJson) {
      res.status(400).json({ ok: false, message: GENERIC_ERROR, errors });
    } else {
      res.status(400).send(renderErrorPage(GENERIC_ERROR));
    }
    return;
  }

  const ip = req.ip ?? req.socket?.remoteAddress ?? 'unknown';
  const identifierHash = sha256Hex(`${ip}:${env.rateLimitHashSalt}`);
  const userAgentHash = sha256Hex(req.get('User-Agent') ?? '');

  const { allowed } = await consumeRateLimit(db, identifierHash);
  if (!allowed) {
    if (asJson) {
      res.status(429).json({ ok: false, message: RATE_LIMIT_ERROR });
    } else {
      res.status(429).send(renderErrorPage(RATE_LIMIT_ERROR));
    }
    return;
  }

  const docRef = await db.collection('quotationRequests').add({
    ...values,
    createdAt: FieldValue.serverTimestamp(),
    status: 'new',
    source: 'web',
    userAgentHash,
  });

  try {
    await sendNotificationEmail(values, docRef.id);
  } catch (err) {
    console.error('sendNotificationEmail failed', err);
  }

  if (asJson) {
    res.status(200).json({ ok: true });
  } else {
    res.status(200).send(renderSuccessPage());
  }
});

export const listQuotations = makeListQuotations(db);
