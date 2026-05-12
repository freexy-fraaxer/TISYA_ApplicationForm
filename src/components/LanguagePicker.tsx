import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGES } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LanguagePicker = () => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative z-[300]" id="language-picker">
      <motion.button
        type="button"
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-secondary/60 backdrop-blur-md border border-white/10",
          "text-foreground text-xs font-medium",
          "hover:bg-secondary/80 hover:border-primary/30",
          "transition-colors duration-200 cursor-pointer",
          "shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
        )}
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-primary/80" />
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.native}</span>
        <svg
          className={cn("w-3 h-3 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute right-0 top-full mt-2 min-w-[180px]",
              "rounded-xl overflow-hidden",
              "bg-background/95 backdrop-blur-xl",
              "border border-white/10",
              "shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
            )}
          >
            <div className="py-1.5">
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm",
                    "transition-colors duration-150",
                    l.code === lang
                      ? "bg-primary/15 text-primary font-medium"
                      : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
                  )}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.native}</span>
                  {l.code === lang && (
                    <motion.div
                      layoutId="lang-check"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguagePicker;
