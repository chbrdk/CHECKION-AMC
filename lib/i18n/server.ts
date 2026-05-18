import { resolveAmcLocale } from '@/lib/amc-locale';
import { createTranslator } from './index';

export const getServerLocale = async (): Promise<'de' | 'en'> => {
  return resolveAmcLocale();
};

export const getServerT = async () => createTranslator(await getServerLocale());
