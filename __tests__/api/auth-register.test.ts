/**
 * API tests: POST /api/auth/register (AMC)
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { __resetRateLimitStoresForTests } from '@/lib/rate-limit';

const validBody = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'ACME GmbH',
  password: 'Password123',
  marketingOptIn: true,
};

describe('POST /api/auth/register', () => {
  const originalEnv = process.env;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      RATE_LIMIT_REGISTER_MAX: '10',
      RATE_LIMIT_REGISTER_WINDOW_MS: '60000',
    };
    __resetRateLimitStoresForTests();
  });

  afterEach(() => {
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
    __resetRateLimitStoresForTests();
  });

  it('returns 400 when marketing opt-in is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, marketingOptIn: false }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/marketing|consent/i);
  });

  it('returns 400 when password is too short', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...validBody, password: 'short' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('registers at PLEXON and patches profile when configured', async () => {
    process.env.PLEXON_AUTH_URL = 'https://plexon.test';
    process.env.PLEXON_SERVICE_SECRET = 'test-secret-16chars';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ userId: 'plexon-user-1' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: 'plexon-user-1' } }), { status: 200 }));
    globalThis.fetch = fetchMock as typeof fetch;

    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ success: true, userId: 'plexon-user-1', plexon: true });
    expect(json.login).toBeUndefined();
  });
});
