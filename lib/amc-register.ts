import { z } from 'zod';
import { passwordSchema } from '@/lib/api-schemas';

/** AMC registration: name, email, company, password, mandatory marketing opt-in. */
export const amcRegisterBodySchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  email: z.string().email('Valid email required'),
  company: z.string().trim().min(1, 'Company name is required').max(200),
  password: passwordSchema,
  marketingOptIn: z.literal(true, {
    errorMap: () => ({ message: 'Marketing consent is required' }),
  }),
});

export type AmcRegisterBody = z.infer<typeof amcRegisterBodySchema>;
