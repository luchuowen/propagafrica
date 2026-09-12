import { createHash } from 'node:crypto';

// One-way hash used for both the rate-limit identifier and userAgentHash. Never store or log
// the raw input (an IP address or a user-agent string) alongside the hash.
export function sha256Hex(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}
