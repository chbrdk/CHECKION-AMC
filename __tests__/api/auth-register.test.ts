/**
 * API tests: POST /api/auth/register (AMC)
 * Run: npm run test
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { __resetRateLimitStoresForTests } from '@/lib/rate-limit';

const validBody = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  company: 'ACME GmbH',
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

  it('returns 400 when email is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ada', company: 'ACME' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain('email');
  });

  it('returns 400 when company is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Ada', email: 'ada@example.com' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/company/i);
  });

  it('returns 400 when name is missing', async () => {
    const req = new Request('http://localhost/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ada@example.com', company: 'ACME' }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/name/i);
  });

  it('returns 429 when IP exceeds register rate limit', async () => {
    process.env.RATE_LIMIT_REGISTER_MAX = '2';
    process.env.RATE_LIMIT_REGISTER_WINDOW_MS = '60000';
    __resetRateLimitStoresForTests();

    const mkReq = () =>
      new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '203.0.113.99',
        },
        body: JSON.stringify({ email: 'bad' }),
      });

    let res = await POST(mkReq());
    expect(res.status).toBe(400);
    res = await POST(mkReq());
    expect(res.status).toBe(400);
    res = await POST(mkReq());
    expect(res.status).toBe(429);
    const json = await res.json();
    expect(json.error).toMatch(/too many registration/i);
  });

  it('registers at PLEXON, patches company, and returns login credentials', async () => {
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
    expect(json.success).toBe(true);
    expect(json.userId).toBe('plexon-user-1');
    expect(json.plexon).toBe(true);
    expect(json.login?.email).toBe('ada@example.com');
    expect(typeof json.login?.password).toBe('string');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
