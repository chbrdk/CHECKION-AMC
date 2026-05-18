import { randomBytes } from 'crypto';
import { z } from 'zod';

/** AMC registration: name, email, company (password generated server-side). */
export const amcRegisterBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().email('Valid email required'),
  company: z.string().trim().min(1, 'Company name is required').max(200),
});

export type AmcRegisterBody = z.infer<typeof amcRegisterBodySchema>;

/** Meets CHECKION password policy for auto-provisioned demo accounts. */
export function generateAmcRegistrationPassword(): string {
  const suffix = randomBytes(12).toString('base64url');
  return `Aa1${suffix}`;
}
