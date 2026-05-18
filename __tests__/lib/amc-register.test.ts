import { describe, expect, it } from 'vitest';
import { amcRegisterBodySchema } from '@/lib/amc-register';

const valid = {
  name: 'Ada',
  email: 'ada@example.com',
  company: 'ACME GmbH',
  password: 'Password123',
  marketingOptIn: true as const,
};

describe('amcRegisterBodySchema', () => {
  it('requires name, email, company, password, and marketing opt-in', () => {
    expect(amcRegisterBodySchema.safeParse(valid).success).toBe(true);
    expect(amcRegisterBodySchema.safeParse({ ...valid, marketingOptIn: false }).success).toBe(false);
    expect(amcRegisterBodySchema.safeParse({ ...valid, password: 'short' }).success).toBe(false);
    expect(amcRegisterBodySchema.safeParse({ ...valid, company: '' }).success).toBe(false);
  });
});
