import en from './translations/en';

export type Translations = typeof en;
export type Language = 'en' | 'tr' | 'ar' | 'de' | 'ru' | 'ur' | 'bn';

export interface LangOption {
  code: Language;
  native: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LangOption[] = [
  { code: 'en', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'tr', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ar', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'de', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'ru', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'ur', native: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'bn', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
];

const translationLoaders: Record<Language, () => Promise<{ default: Translations }>> = {
  en: () => import('./translations/en'),
  tr: () => import('./translations/tr'),
  ar: () => import('./translations/ar'),
  de: () => import('./translations/de'),
  ru: () => import('./translations/ru'),
  ur: () => import('./translations/ur'),
  bn: () => import('./translations/bn'),
};

const cache: Partial<Record<Language, Translations>> = { en };

export async function loadTranslation(lang: Language): Promise<Translations> {
  if (cache[lang]) return cache[lang]!;
  const mod = await translationLoaders[lang]();
  cache[lang] = mod.default;
  return mod.default;
}

export { en };
