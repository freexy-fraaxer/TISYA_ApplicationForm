import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Language, Translations, LANGUAGES, loadTranslation, en } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  t: Translations;
  setLang: (lang: Language) => void;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: en,
  setLang: () => {},
  dir: 'ltr',
  isRTL: false,
});

export const useLanguage = () => useContext(LanguageContext);
export const useT = () => useContext(LanguageContext).t;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('tisya-lang') as Language | null;
    return saved && LANGUAGES.some(l => l.code === saved) ? saved : 'en';
  });
  const [t, setT] = useState<Translations>(en);

  const currentLangOption = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  const setLang = useCallback(async (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('tisya-lang', newLang);
    const translations = await loadTranslation(newLang);
    setT(translations);
  }, []);

  // Load initial language on mount
  useEffect(() => {
    if (lang !== 'en') {
      loadTranslation(lang).then(setT);
    }
  }, []);

  // Set document direction
  useEffect(() => {
    document.documentElement.dir = currentLangOption.dir;
    document.documentElement.lang = lang;
  }, [lang, currentLangOption.dir]);

  return (
    <LanguageContext.Provider value={{
      lang,
      t,
      setLang,
      dir: currentLangOption.dir,
      isRTL: currentLangOption.dir === 'rtl',
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
