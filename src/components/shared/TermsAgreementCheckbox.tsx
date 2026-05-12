import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Check } from "lucide-react";
import HeroButton from "@/components/HeroButton";
import { cn } from "@/lib/utils";

import { useT } from "@/contexts/LanguageContext";

export type TermsRole = "pathfinder" | "opportunist";

interface TermsAgreementCheckboxProps {
  role: TermsRole;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  showError?: boolean;
}


const TermsAgreementCheckbox = ({
  role,
  checked,
  onCheckedChange,
  showError = false,
}: TermsAgreementCheckboxProps) => {
  const t = useT();
  const [open, setOpen] = useState(false);
  const terms = t.terms[role];

  const handleCheckboxClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (checked) {
      // Allow uncheck without modal
      onCheckedChange(false);
      return;
    }
    setOpen(true);
  };

  const handleAgree = () => {
    onCheckedChange(true);
    setOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg border transition-colors",
          checked
            ? "bg-primary/5 border-primary/40"
            : showError
            ? "bg-destructive/5 border-destructive/50"
            : "bg-secondary/30 border-border/50"
        )}
      >
        <Checkbox
          id="terms_agreement"
          checked={checked}
          onClick={handleCheckboxClick}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") handleCheckboxClick(e);
          }}
          className="mt-0.5"
          aria-label="Open TISYA Terms"
        />
        <div className="flex-1">
          <label
            htmlFor="terms_agreement"
            className="text-sm text-foreground leading-relaxed cursor-pointer block"
            onClick={handleCheckboxClick}
          >
            {t.pathfinderForm.step3.agreeToTerms} <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-primary/80 hover:text-primary mt-1 underline-offset-2 hover:underline transition-colors"
          >
            {t.pathfinderForm.step3.clickToReviewTerms}
          </button>
        </div>
        {checked && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-primary mt-1"
            aria-hidden
          >
            <ShieldCheck className="w-4 h-4" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showError && !checked && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-destructive text-xs mt-2"
          >
            {t.pathfinderForm.step3.mustAgreeTerms}
          </motion.p>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] p-0 gap-0 bg-background border-primary/20 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 sm:p-6 border-b border-border/50">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-primary/70 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t.terms.agreement}
            </div>
            <DialogTitle className="text-lg sm:text-xl font-bold text-foreground leading-snug pr-8">
              {terms.title}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto max-h-[55vh]">
            <div className="p-5 sm:p-6 space-y-5 text-sm leading-relaxed">
              <p className="text-muted-foreground italic">{terms.intro}</p>
              {terms.sections.map((section) => (
                <div key={section.heading} className="space-y-1.5">
                  <h3 className="font-semibold text-foreground">{section.heading}</h3>
                  <p className="text-muted-foreground">{section.body}</p>
                </div>
              ))}
              <p className="text-foreground/90 pt-2 border-t border-border/40 italic">
                {terms.closing}
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-t border-border/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 bg-secondary/20">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 text-sm rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              {t.common.close}
            </button>
            <HeroButton size="md" onClick={handleAgree}>
              <Check className="w-4 h-4" />
              {t.terms.iHaveReadAndAgree}
            </HeroButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TermsAgreementCheckbox;
