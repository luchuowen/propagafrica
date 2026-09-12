import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

// firestore.rules lives at the repo root (session 6 owns it), not inside functions/ — this
// package only reads the file, it doesn't duplicate the rules.
const RULES_PATH = join(__dirname, '..', '..', 'firestore.rules');

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'propagafrica-rules-test',
    firestore: {
      rules: readFileSync(RULES_PATH, 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

describe('firestore.rules — quotationRequests', () => {
  it('denies an unauthenticated client read', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('quotationRequests').doc('anything').get());
  });

  it('denies an unauthenticated client write', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('quotationRequests').add({ name: 'test' }));
  });

  it('denies a read from an authenticated but unprivileged user', async () => {
    const db = testEnv.authenticatedContext('some-signed-in-user').firestore();
    await assertFails(db.collection('quotationRequests').doc('anything').get());
  });

  it('denies a write from an authenticated but unprivileged user', async () => {
    const db = testEnv.authenticatedContext('some-signed-in-user').firestore();
    await assertFails(db.collection('quotationRequests').add({ name: 'test' }));
  });
});

describe('firestore.rules — rateLimits', () => {
  it('denies unauthenticated and authenticated client access alike', async () => {
    const anon = testEnv.unauthenticatedContext().firestore();
    const user = testEnv.authenticatedContext('some-signed-in-user').firestore();
    await assertFails(anon.collection('rateLimits').doc('x').get());
    await assertFails(user.collection('rateLimits').doc('x').get());
  });
});

describe('firestore.rules — default deny', () => {
  it('denies access to a collection not explicitly named in the rules', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(db.collection('somethingElse').doc('x').get());
  });
});

// Sanity check that the rules file can be satisfied at all with security rules disabled — proves
// a failure above is the rules denying access, not a broken emulator connection.
describe('firestore.rules — emulator sanity check', () => {
  it('allows a write when rules are bypassed with the admin SDK', async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await assertSucceeds(
        context.firestore().collection('quotationRequests').doc('seed').set({ name: 'test' }),
      );
    });
  });
});
