/* ------------------------------------------------------------------ */
/*  CHECKION-AMC – POST /api/auth/register                             */
/* ------------------------------------------------------------------ */

import { NextResponse } from 'next/server';
import { apiError, handleApiError, API_STATUS } from '@/lib/api-error-handler';
import { parseApiBody } from '@/lib/api-schemas';
import { amcRegisterBodySchema } from '@/lib/amc-register';
import { recordAmcMarketingConsent } from '@/lib/amc-marketing-consent';
import { checkRateLimit, getClientIpForRateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import {
  isPlexonAuthConfigured,
  patchPlexonProfile,
  registerUserAtPlexon,
} from '@/lib/plexon-auth';

const SALT_ROUNDS = 10;

export async function POST(request: Request) {
    if (!process.env.DATABASE_URL) {
        console.error('[CHECKION-AMC] DATABASE_URL is not set');
        return apiError('Server misconfiguration: database not configured.', API_STATUS.UNAVAILABLE);
    }
    const ip = getClientIpForRateLimit(request);
    const rl = await checkRateLimit(`register:${ip}`, 'register');
    if (!rl.allowed) {
        return apiError(
            'Too many registration attempts. Please try again later.',
            API_STATUS.TOO_MANY_REQUESTS,
            rl.retryAfter ? { retryAfter: rl.retryAfter } : undefined
        );
    }
    try {
        const parsed = await parseApiBody(request, amcRegisterBodySchema);
        if (parsed instanceof NextResponse) return parsed;
        const email = parsed.email.trim().toLowerCase();
        const name = parsed.name.trim();
        const company = parsed.company.trim();
        const password = parsed.password;
        const db = getDb();

        if (isPlexonAuthConfigured()) {
            const pr = await registerUserAtPlexon({ email, password, name });
            if (!pr.ok) {
                if (pr.status === 409) {
                    return apiError('Email already registered.', API_STATUS.CONFLICT);
                }
                return apiError(pr.error || 'PLEXON registration failed.', pr.status);
            }
            await patchPlexonProfile(pr.userId, { name, company });
            await recordAmcMarketingConsent(db, { userId: pr.userId, email, name, company });
            return NextResponse.json({ success: true, userId: pr.userId, plexon: true });
        }

        const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
        if (existing.length > 0) {
            return apiError('Email already registered.', API_STATUS.CONFLICT);
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const id = randomUUID();
        await db.insert(users).values({
            id,
            email,
            passwordHash,
            name,
            company,
        });
        await recordAmcMarketingConsent(db, { userId: id, email, name, company });

        return NextResponse.json({ success: true, userId: id });
    } catch (e) {
        return handleApiError(e, { context: 'Register failed', publicMessage: 'Registration failed.' });
    }
}
