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

type TranslationModule = { default: Translations };
const translationLoaders: Record<Language, () => Promise<TranslationModule>> = {
  en: () => import('./translations/en') as unknown as Promise<TranslationModule>,
  tr: () => import('./translations/tr') as unknown as Promise<TranslationModule>,
  ar: () => import('./translations/ar') as unknown as Promise<TranslationModule>,
  de: () => import('./translations/de') as unknown as Promise<TranslationModule>,
  ru: () => import('./translations/ru') as unknown as Promise<TranslationModule>,
  ur: () => import('./translations/ur') as unknown as Promise<TranslationModule>,
  bn: () => import('./translations/bn') as unknown as Promise<TranslationModule>,
};

const cache: Partial<Record<Language, Translations>> = { en };

export async function loadTranslation(lang: Language): Promise<Translations> {
  if (cache[lang]) return cache[lang]!;
  const mod = await translationLoaders[lang]();
  cache[lang] = mod.default;
  return mod.default;
}

export { en };
