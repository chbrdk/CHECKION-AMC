import { z } from 'zod';

const AMC_PASSWORD_MIN_LENGTH = 8;

const amcPasswordSchema = z
  .string()
  .min(AMC_PASSWORD_MIN_LENGTH, `Passwort muss mindestens ${AMC_PASSWORD_MIN_LENGTH} Zeichen haben`)
  .refine((p) => /[A-Z]/.test(p), 'Passwort muss mindestens einen Großbuchstaben enthalten')
  .refine((p) => /[a-z]/.test(p), 'Passwort muss mindestens einen Kleinbuchstaben enthalten')
  .refine((p) => /\d/.test(p), 'Passwort muss mindestens eine Ziffer enthalten');

/** AMC registration: name, email, company, password, mandatory marketing opt-in. */
export const amcRegisterBodySchema = z.object({
  name: z.string().trim().min(1, 'Name ist erforderlich').max(200),
  email: z.string().email('Gültige E-Mail-Adresse erforderlich'),
  company: z.string().trim().min(1, 'Unternehmensname ist erforderlich').max(200),
  password: amcPasswordSchema,
  marketingOptIn: z.literal(true, {
    errorMap: () => ({ message: 'Marketing-Einwilligung ist erforderlich' }),
  }),
});

export type AmcRegisterBody = z.infer<typeof amcRegisterBodySchema>;
