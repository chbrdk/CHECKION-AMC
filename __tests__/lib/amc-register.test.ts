import { describe, expect, it } from 'vitest';
import { amcRegisterBodySchema, generateAmcRegistrationPassword } from '@/lib/amc-register';

describe('amcRegisterBodySchema', () => {
  it('requires name, email, and company', () => {
    expect(
      amcRegisterBodySchema.safeParse({
        name: 'Ada',
        email: 'ada@example.com',
        company: 'ACME GmbH',
      }).success
    ).toBe(true);
    expect(amcRegisterBodySchema.safeParse({ email: 'ada@example.com', company: 'ACME' }).success).toBe(false);
    expect(amcRegisterBodySchema.safeParse({ name: 'Ada', email: 'bad', company: 'ACME' }).success).toBe(false);
    expect(amcRegisterBodySchema.safeParse({ name: 'Ada', email: 'ada@example.com', company: '' }).success).toBe(
      false
    );
  });
});

describe('generateAmcRegistrationPassword', () => {
  it('meets policy minimum shape', () => {
    const p = generateAmcRegistrationPassword();
    expect(p.length).toBeGreaterThanOrEqual(12);
    expect(/[A-Z]/.test(p)).toBe(true);
    expect(/[a-z]/.test(p)).toBe(true);
    expect(/\d/.test(p)).toBe(true);
  });
});
