import type { Firestore } from 'firebase-admin/firestore';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { RATE_LIMIT_MAX_PER_WINDOW, RATE_LIMIT_WINDOW_MS } from './schema';

// Fixed-window limiter keyed by a hashed identifier (see hash.ts) — never the raw IP.
// Firestore rules deny all client access to `rateLimits`, same as `quotationRequests`.
export async function consumeRateLimit(
  db: Firestore,
  identifierHash: string,
): Promise<{ allowed: boolean }> {
  const ref = db.collection('rateLimits').doc(identifierHash);

  return db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const now = Date.now();

    if (!snap.exists) {
      tx.set(ref, { count: 1, windowStart: Timestamp.fromMillis(now) });
      return { allowed: true };
    }

    const data = snap.data() as { count: number; windowStart: Timestamp };
    const windowStartMs = data.windowStart.toMillis();

    if (now - windowStartMs >= RATE_LIMIT_WINDOW_MS) {
      tx.set(ref, { count: 1, windowStart: Timestamp.fromMillis(now) });
      return { allowed: true };
    }

    if (data.count >= RATE_LIMIT_MAX_PER_WINDOW) {
      return { allowed: false };
    }

    tx.update(ref, { count: FieldValue.increment(1) });
    return { allowed: true };
  });
}
