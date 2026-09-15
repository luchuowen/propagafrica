import { onCall, HttpsError } from 'firebase-functions/v2/https';
import type { Firestore } from 'firebase-admin/firestore';
import { env } from './env';

export interface QuotationListItem {
  id: string;
  name: string;
  farmOrCompany: string;
  email: string;
  phone: string;
  country: string;
  enquiringAbout: string[];
  message: string;
  status: string;
  source: string;
  createdAt: string | null;
}

// Second authenticated function behind /admin — the site never reads quotationRequests
// directly from Firestore (rules deny all client access, with no exceptions). Requires a signed-
// in Firebase Auth user; an email not on the allow-list gets an empty list, never an error, so
// the response shape never reveals allow-list membership.
export function makeListQuotations(db: Firestore) {
  return onCall(async (request) => {
    if (!request.auth?.token?.email) {
      throw new HttpsError('unauthenticated', 'Sign in to view quotation requests.');
    }

    const email = String(request.auth.token.email).toLowerCase();
    if (!env.allowedAdminEmails.includes(email)) {
      return { requests: [] satisfies QuotationListItem[] };
    }

    const snapshot = await db
      .collection('quotationRequests')
      .orderBy('createdAt', 'desc')
      .limit(200)
      .get();

    const requests: QuotationListItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: String(data.name ?? ''),
        farmOrCompany: String(data.farmOrCompany ?? ''),
        email: String(data.email ?? ''),
        phone: String(data.phone ?? ''),
        country: String(data.country ?? ''),
        enquiringAbout: Array.isArray(data.enquiringAbout) ? data.enquiringAbout.map(String) : [],
        message: String(data.message ?? ''),
        status: String(data.status ?? 'new'),
        source: String(data.source ?? 'web'),
        createdAt: data.createdAt?.toDate?.().toISOString() ?? null,
      };
    });

    return { requests };
  });
}
