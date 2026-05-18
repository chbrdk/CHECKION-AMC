import type { getDb } from '@/lib/db';
import { recordMarketingConsent } from '@/lib/marketing-consent';

/** @deprecated Use recordMarketingConsent — re-export for AMC register route. */
export async function recordAmcMarketingConsent(
  db: ReturnType<typeof getDb>,
  params: { userId: string; email: string; name: string; company: string }
): Promise<void> {
  await recordMarketingConsent(db, { ...params, source: 'amc' });
}
