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
  en: () => import('./translations/en') as Promise<{ default: Translations }>,
  tr: () => import('./translations/tr') as Promise<{ default: Translations }>,
  ar: () => import('./translations/ar') as Promise<{ default: Translations }>,
  de: () => import('./translations/de') as Promise<{ default: Translations }>,
  ru: () => import('./translations/ru') as Promise<{ default: Translations }>,
  ur: () => import('./translations/ur') as Promise<{ default: Translations }>,
  bn: () => import('./translations/bn') as Promise<{ default: Translations }>,
};

const cache: Partial<Record<Language, Translations>> = { en };

export async function loadTranslation(lang: Language): Promise<Translations> {
  if (cache[lang]) return cache[lang]!;
  const mod = await translationLoaders[lang]();
  cache[lang] = mod.default;
  return mod.default;
}

export { en };
