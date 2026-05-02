import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck, Check } from "lucide-react";
import HeroButton from "@/components/HeroButton";
import { cn } from "@/lib/utils";

export type TermsRole = "pathfinder" | "opportunist";

interface TermsSection {
  heading: string;
  body: string;
}

interface TermsContent {
  title: string;
  intro: string;
  sections: TermsSection[];
  closing: string;
}

const TERMS: Record<TermsRole, TermsContent> = {
  pathfinder: {
    title: "TISYA Pathfinder (Member) Terms of Participation",
    intro:
      "By submitting this form, I acknowledge and agree to the following as a Pathfinder of TISYA:",
    sections: [
      {
        heading: "1. Purpose & Participation",
        body: "I am joining TISYA to explore opportunities, contribute where possible, and be part of a collaborative and growth-oriented community.",
      },
      {
        heading: "2. Respect & Conduct",
        body: "I will engage respectfully with members, teams, and partners, and represent TISYA in a positive and appropriate manner.",
      },
      {
        heading: "3. Engagement",
        body: "I understand that participation is flexible, and I am encouraged to stay engaged with activities, programs, and opportunities that align with my interests.",
      },
      {
        heading: "4. Data Usage",
        body: "I consent to TISYA collecting and using my provided information for communication, coordination, and organizational purposes.",
      },
      {
        heading: "5. Media Consent",
        body: "I agree that photos, videos, or content from TISYA activities may be used for communication and promotional purposes.",
      },
      {
        heading: "6. Community Integrity",
        body: "I will act with honesty and respect, and understand that continued participation is based on maintaining a positive and constructive presence.",
      },
    ],
    closing: "By submitting this form, I confirm that I have read and agreed to these terms.",
  },
  opportunist: {
    title: "TISYA Opportunist Agreement",
    intro:
      "By submitting this form, I acknowledge and agree to the following terms as a volunteer (\u201COpportunist\u201D) with TISYA:",
    sections: [
      {
        heading: "Purpose & Intent",
        body: "I am joining TISYA to contribute, learn, and be part of initiatives that turn ideas into real impact. I understand that this role is built on initiative, collaboration, and shared growth.",
      },
      {
        heading: "1. Commitment & Participation",
        body: "I agree to actively contribute to assigned tasks, events, or initiatives to the best of my ability and remain engaged throughout my involvement.",
      },
      {
        heading: "2. Time Commitment",
        body: "I acknowledge that my level of involvement and responsibilities may vary based on my selected role, availability, and ongoing activities. I agree to manage my time responsibly and communicate clearly regarding my availability and capacity.",
      },
      {
        heading: "3. Professional Conduct",
        body: "I will represent TISYA in a respectful and professional manner at all times, both online and in person.",
      },
      {
        heading: "4. Responsibility & Accountability",
        body: "I understand that I may be assigned specific responsibilities and I agree to complete them reliably, meeting agreed timelines and communicating proactively if challenges arise.",
      },
      {
        heading: "5. Team Collaboration",
        body: "I will work cooperatively with team members, respect diverse perspectives, and contribute positively to the overall environment.",
      },
      {
        heading: "6. Confidentiality",
        body: "I acknowledge that during my involvement, I may have access to internal information, plans, communications, or partner-related details. I agree not to disclose, share, or misuse such information outside of TISYA without prior authorization.",
      },
      {
        heading: "7. Intellectual Contribution & Usage",
        body: "I acknowledge that any ideas, content, or work I contribute as part of TISYA initiatives may be used by TISYA for its programs, events, and promotions, with appropriate recognition where applicable.",
      },
      {
        heading: "8. Data Usage & Privacy",
        body: "I consent to TISYA collecting and using my provided personal information (such as name, contact details, and relevant background information) for communication, coordination, and organizational purposes. I understand that my data will not be shared externally without consent unless required for operational needs.",
      },
      {
        heading: "9. Media & Communication Consent",
        body: "I agree that photos, videos, or content captured during TISYA activities may be used for promotional, documentation, or communication purposes.",
      },
      {
        heading: "10. Financial Understanding",
        body: "I understand that this is a voluntary role and does not constitute employment. No financial compensation is guaranteed unless explicitly stated. I also agree not to incur expenses on behalf of TISYA without prior approval.",
      },
      {
        heading: "11. Code of Integrity",
        body: "I will uphold honesty, respect, and ethical behavior in all activities associated with TISYA.",
      },
      {
        heading: "12. Flexibility & Changes",
        body: "I understand that roles, responsibilities, and requirements may evolve, and I agree to remain reasonably adaptable.",
      },
      {
        heading: "13. Termination of Participation",
        body: "TISYA reserves the right to discontinue volunteer participation if expectations are not met or if conduct does not align with organizational values.",
      },
    ],
    closing: "By submitting this form, I confirm that I have read, understood, and agreed to the above terms.",
  },
};

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
  const [open, setOpen] = useState(false);
  const terms = TERMS[role];

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
            I agree to the TISYA Terms <span className="text-destructive">*</span>
          </label>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="text-xs text-primary/80 hover:text-primary mt-1 underline-offset-2 hover:underline transition-colors"
          >
            Click to review terms
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
            You must agree to the TISYA Terms to continue.
          </motion.p>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl w-[calc(100vw-2rem)] p-0 gap-0 bg-background border-primary/20 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-5 sm:p-6 border-b border-border/50">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-primary/70 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              Agreement
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
              Close
            </button>
            <HeroButton size="md" onClick={handleAgree}>
              <Check className="w-4 h-4" />
              I have read and agree
            </HeroButton>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TermsAgreementCheckbox;
