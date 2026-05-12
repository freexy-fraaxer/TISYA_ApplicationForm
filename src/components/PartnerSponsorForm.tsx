import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { useT } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight, Check, Loader2, Building2, Mail, Phone, Globe, User, X, Sparkles, Target } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormFieldError from "./shared/FormFieldError";
import { validateEmail, getEmailError, getRequiredError, validatePhone, getPhoneError } from "@/lib/validation";
import { submitToAppsScript } from "@/lib/submitForm";

interface PartnerSponsorFormProps {
  onBack: () => void;
}

type ContributionType =
  | "Financial Sponsorship"
  | "Event Sponsorship"
  | "Mentorship / Speakers"
  | "Internships / Opportunities"
  | "Resources / Tools"
  | "Strategic Partnership";

interface PartnerFormData {
  // Section 1
  org_name: string;
  org_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  role_title: string;

  // Section 2
  contribution_types: ContributionType[];

  // Financial
  fin_budget: string;
  fin_visibility: string[];
  fin_visibility_other: string;

  // Event
  event_types: string[];
  event_involvement: string;

  // Mentorship
  mentor_roles: string[];
  mentor_topics: string;

  // Internships
  intern_types: string[];
  intern_fields: string;
  intern_positions: string;

  // Resources
  resource_support: string;

  // Strategic
  strategic_idea: string;

  // Audience
  audiences: string[];
  audience_fields: string;

  // Section 3
  collab_vision: string;
  why_tisya: string;
  prior_partnership: string; // "Yes" | "No"
  prior_description: string;
  additional_details: string;

  // Misc
  consent: boolean;
  honeypot: string;
}

const initialData: PartnerFormData = {
  org_name: "",
  org_type: "",
  contact_name: "",
  role_title: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  contribution_types: [],
  fin_budget: "",
  fin_visibility: [],
  fin_visibility_other: "",
  event_types: [],
  event_involvement: "",
  mentor_roles: [],
  mentor_topics: "",
  intern_types: [],
  intern_fields: "",
  intern_positions: "",
  resource_support: "",
  strategic_idea: "",
  audiences: [],
  audience_fields: "",
  collab_vision: "",
  why_tisya: "",
  prior_partnership: "",
  prior_description: "",
  additional_details: "",
  consent: false,
  honeypot: "",
};

const ORG_TYPES = [
  "Startup",
  "Corporate",
  "NGO / Non-profit",
  "Educational Institution",
  "Government / Public Sector",
  "Individual Sponsor",
];

const CONTRIBUTION_OPTIONS: ContributionType[] = [
  "Financial Sponsorship",
  "Event Sponsorship",
  "Mentorship / Speakers",
  "Internships / Opportunities",
  "Resources / Tools",
  "Strategic Partnership",
];

const FIN_BUDGETS = ["Less than $500", "$500 – $2,000", "$2,000 – $5,000", "$5,000+"];
const FIN_VISIBILITY = ["Event branding", "Social media", "Website presence"];
const EVENT_TYPES = ["Workshops", "Networking events", "Panels / Talks", "Competitions"];
const EVENT_INVOLVEMENT = ["Sponsor only", "Co-host", "Lead organizer"];
const MENTOR_PROVIDE = ["Speakers", "Mentors", "Workshop leaders"];
const INTERN_TYPES = ["Internships", "Part-time roles", "Full-time roles"];
const AUDIENCES = ["Students", "Early Professionals", "Entrepreneurs", "Specific Fields"];

const getOrgTypeLabel = (val: string, t: any) => {
  switch (val) {
    case "Startup": return t.partnerSponsorForm.orgTypes.startup;
    case "Corporate": return t.partnerSponsorForm.orgTypes.corporate;
    case "NGO / Non-profit": return t.partnerSponsorForm.orgTypes.ngo;
    case "Educational Institution": return t.partnerSponsorForm.orgTypes.edu;
    case "Government / Public Sector": return t.partnerSponsorForm.orgTypes.gov;
    case "Individual Sponsor": return t.partnerSponsorForm.orgTypes.individual;
    default: return val;
  }
};

const getContributionLabel = (val: string, t: any) => {
  switch (val) {
    case "Financial Sponsorship": return t.partnerSponsorForm.contributions.financial;
    case "Event Sponsorship": return t.partnerSponsorForm.contributions.event;
    case "Mentorship / Speakers": return t.partnerSponsorForm.contributions.mentorship;
    case "Internships / Opportunities": return t.partnerSponsorForm.contributions.internships;
    case "Resources / Tools": return t.partnerSponsorForm.contributions.resources;
    case "Strategic Partnership": return t.partnerSponsorForm.contributions.strategic;
    default: return val;
  }
};

const getFinBudgetLabel = (val: string, t: any) => {
  switch (val) {
    case "Less than $500": return t.partnerSponsorForm.finBudgets.lessThan500;
    case "$500 – $2,000": return t.partnerSponsorForm.finBudgets.between500And2k;
    case "$2,000 – $5,000": return t.partnerSponsorForm.finBudgets.between2kAnd5k;
    case "$5,000+": return t.partnerSponsorForm.finBudgets.moreThan5k;
    default: return val;
  }
};

const getFinVisibilityLabel = (val: string, t: any) => {
  switch (val) {
    case "Event branding": return t.partnerSponsorForm.finVisibilityOptions.eventBranding;
    case "Social media": return t.partnerSponsorForm.finVisibilityOptions.socialMedia;
    case "Website presence": return t.partnerSponsorForm.finVisibilityOptions.websitePresence;
    default: return val;
  }
};

const getEventTypeLabel = (val: string, t: any) => {
  switch (val) {
    case "Workshops": return t.partnerSponsorForm.eventTypes.workshops;
    case "Networking events": return t.partnerSponsorForm.eventTypes.networking;
    case "Panels / Talks": return t.partnerSponsorForm.eventTypes.panels;
    case "Competitions": return t.partnerSponsorForm.eventTypes.competitions;
    default: return val;
  }
};

const getEventInvolvementLabel = (val: string, t: any) => {
  switch (val) {
    case "Sponsor only": return t.partnerSponsorForm.eventInvolvements.sponsor;
    case "Co-host": return t.partnerSponsorForm.eventInvolvements.coHost;
    case "Lead organizer": return t.partnerSponsorForm.eventInvolvements.lead;
    default: return val;
  }
};

const getMentorRoleLabel = (val: string, t: any) => {
  switch (val) {
    case "Speakers": return t.partnerSponsorForm.mentorRoles.speakers;
    case "Mentors": return t.partnerSponsorForm.mentorRoles.mentors;
    case "Workshop leaders": return t.partnerSponsorForm.mentorRoles.workshopLeaders;
    default: return val;
  }
};

const getInternTypeLabel = (val: string, t: any) => {
  switch (val) {
    case "Internships": return t.partnerSponsorForm.internTypes.internships;
    case "Part-time roles": return t.partnerSponsorForm.internTypes.partTime;
    case "Full-time roles": return t.partnerSponsorForm.internTypes.fullTime;
    default: return val;
  }
};

const getAudienceLabel = (val: string, t: any) => {
  switch (val) {
    case "Students": return t.partnerSponsorForm.audiences.students;
    case "Early Professionals": return t.partnerSponsorForm.audiences.earlyProfessionals;
    case "Entrepreneurs": return t.partnerSponsorForm.audiences.entrepreneurs;
    case "Specific Fields": return t.partnerSponsorForm.audiences.specificFields;
    default: return val;
  }
};

// Reusable chip-style multi-select toggle
const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors duration-150 ${
      active
        ? "bg-primary/20 border-primary text-foreground"
        : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

// Inline accordion-style micro card
const MicroCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{ duration: 0.25 }}
    className="overflow-hidden"
  >
    <div className="ml-2 mt-2 border-l-2 border-primary/40 pl-4 py-3 space-y-3">
      <p className="text-xs font-mono uppercase tracking-[0.15em] text-primary/70">{title}</p>
      {children}
    </div>
  </motion.div>
);

const PartnerSponsorForm = ({ onBack }: PartnerSponsorFormProps) => {
  const t = useT();
  const { playBack, playPulse } = useSound();
  const { triggerPulse } = useBackgroundEffects();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<PartnerFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (updates: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (submitError) setSubmitError(null);
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const toggle = <K extends keyof PartnerFormData>(field: K, value: string) => {
    const arr = formData[field] as unknown as string[];
    const next = arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
    update({ [field]: next } as unknown as Partial<PartnerFormData>);
  };

  useEffect(() => {
    const e: Record<string, string | null> = {};
    if (touched.org_name) e.org_name = getRequiredError(formData.org_name, "Organization name");
    if (touched.org_type) e.org_type = getRequiredError(formData.org_type, "Organization type");
    if (touched.contact_name) e.contact_name = getRequiredError(formData.contact_name, "Contact person");
    if (touched.contact_email) e.contact_email = getEmailError(formData.contact_email);
    if (touched.contact_phone) e.contact_phone = getPhoneError(formData.contact_phone);
    if (touched.collab_vision) e.collab_vision = getRequiredError(formData.collab_vision, "This field");

    setErrors(e);
  }, [formData, touched]);

  const step1Valid = !!(
    formData.org_name.trim() &&
    formData.org_type.trim() &&
    formData.contact_name.trim() &&
    formData.contact_email.trim() &&
    validateEmail(formData.contact_email) &&
    validatePhone(formData.contact_phone)
  );

  const step2Valid = formData.contribution_types.length > 0 && formData.audiences.length > 0;

  const canSubmit =
    step1Valid &&
    step2Valid &&
    formData.collab_vision.trim() &&
    formData.prior_partnership &&
    formData.consent;

  const handleNext = () => {
    if (step === 1) {
      setTouched((p) => ({ ...p, org_name: true, org_type: true, contact_name: true, contact_email: true }));
      if (!step1Valid) return;
    }
    if (step === 2 && !step2Valid) return;
    playPulse();
    triggerPulse();
    setStep((s) => Math.min(3, s + 1));
  };

  const handleBack = () => {
  playBack();
  onBack();
};

  const handleStepBack = () => {
  if (step === 1) {
    handleBack();
    return;
  }
  setStep((s) => s - 1);
};

  const handleSubmit = async () => {
  setTouched((p) => ({ ...p, collab_vision: true }));

  if (!canSubmit || formData.honeypot || isSubmitting) return;

  setIsSubmitting(true);
  setSubmitError(null);

  try {
    // Keys MUST exactly match PARTNER_FIELDS in the Apps Script
    const fields: Record<string, unknown> = {
      org_name: formData.org_name.trim(),
      org_type: formData.org_type,
      contact_name: formData.contact_name.trim(),
      role_title: formData.role_title.trim(),
      contact_email: formData.contact_email.trim(),
      contact_phone: formData.contact_phone.trim(),
      website: formData.website.trim(),
      contribution_types: formData.contribution_types,
      fin_budget: formData.fin_budget,
      fin_visibility: formData.fin_visibility,
      fin_visibility_other: formData.fin_visibility_other.trim(),
      event_types: formData.event_types,
      event_involvement: formData.event_involvement,
      mentor_roles: formData.mentor_roles,
      mentor_topics: formData.mentor_topics.trim(),
      intern_types: formData.intern_types,
      intern_fields: formData.intern_fields.trim(),
      intern_positions: formData.intern_positions,
      resource_support: formData.resource_support.trim(),
      strategic_idea: formData.strategic_idea.trim(),
      audiences: formData.audiences,
      audience_fields: formData.audience_fields.trim(),
      collab_vision: formData.collab_vision.trim(),
      why_tisya: formData.why_tisya.trim(),
      prior_partnership: formData.prior_partnership,
      prior_description: formData.prior_description.trim(),
      additional_details: formData.additional_details.trim(),
      consent: formData.consent,
    };

    const res = await submitToAppsScript("partner", fields);

    setGeneratedId(res.generatedId);
    setIsSuccess(true);
  } catch (error) {
    console.error("Submission error:", error);
    setSubmitError(
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <GlassCard
          className="max-w-lg w-full p-8 md:p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Check className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t.partnerSponsorForm.successTitle}</h2>
          <p className="text-lg text-primary/80 font-medium mb-4">{t.partnerSponsorForm.successSubtitle}</p>
          <p className="text-muted-foreground mb-2 text-sm">{t.partnerSponsorForm.successPath}</p>
          <p className="text-muted-foreground mb-6">
            {t.partnerSponsorForm.successDesc}
          </p>
          {generatedId && (
            <div className="glass-card p-4 mb-8">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                {t.common.applicationId}
              </span>
              <p className="text-lg font-mono text-primary font-semibold">{generatedId}</p>
            </div>
          )}
          <HeroButton onClick={handleBack} variant="secondary">{t.common.backToHome}</HeroButton>
        </GlassCard>
      </div>
    );
  }

  const sectionTitle =
    step === 1 ? t.partnerSponsorForm.step1Title : step === 2 ? t.partnerSponsorForm.step2Title : t.partnerSponsorForm.step3Title;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-end mb-6">
          <motion.button
            className="p-2 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150"
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => update({ honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/70 mb-2">
            {t.partnerSponsorForm.progressStep
              .replace("{{current}}", step.toString())
              .replace("{{total}}", "3")
              .replace("{{title}}", sectionTitle)}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2">{t.partnerSponsorForm.title}</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t.partnerSponsorForm.subtitle}
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                n === step ? "w-10 bg-primary" : n < step ? "w-6 bg-primary/60" : "w-6 bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ============ STEP 1 ============ */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.orgName} <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder={t.partnerSponsorForm.orgNamePlaceholder}
                  value={formData.org_name}
                  onChange={(e) => update({ org_name: e.target.value })}
                  onBlur={() => handleBlur("org_name")}
                  className={`bg-secondary/50 border-border focus:border-primary ${errors.org_name ? "border-destructive" : ""}`}
                />
                <FormFieldError error={errors.org_name || null} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.orgType} <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.org_type}
                  onValueChange={(v) => {
                    update({ org_type: v });
                    setTouched((p) => ({ ...p, org_type: true }));
                  }}
                >
                  <SelectTrigger className={`bg-secondary/50 border-border ${errors.org_type ? "border-destructive" : ""}`}>
                    <SelectValue placeholder={t.partnerSponsorForm.orgTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {ORG_TYPES.map((typeVal) => (
                      <SelectItem key={typeVal} value={typeVal}>{getOrgTypeLabel(typeVal, t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.org_type || null} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.contactPerson} <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder={t.partnerSponsorForm.contactPersonPlaceholder}
                  value={formData.contact_name}
                  onChange={(e) => update({ contact_name: e.target.value })}
                  onBlur={() => handleBlur("contact_name")}
                  className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_name ? "border-destructive" : ""}`}
                />
                <FormFieldError error={errors.contact_name || null} />
              </div>
              <div className="space-y-2">
  <Label className="text-sm font-medium flex items-center gap-2">
    <User className="w-4 h-4 text-muted-foreground" />
    {t.partnerSponsorForm.rolePosition}
  </Label>
  <Input
    placeholder={t.partnerSponsorForm.rolePlaceholder}
    value={formData.role_title}
    onChange={(e) => update({ role_title: e.target.value })}
    className="bg-secondary/50 border-border focus:border-primary"
  />
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {t.partnerSponsorForm.email} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder={t.partnerSponsorForm.emailPlaceholder}
                    value={formData.contact_email}
                    onChange={(e) => update({ contact_email: e.target.value })}
                    onBlur={() => handleBlur("contact_email")}
                    className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_email ? "border-destructive" : ""}`}
                  />
                  <FormFieldError error={errors.contact_email || null} />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    {t.partnerSponsorForm.phone}
                  </Label>
                  <Input
                    type="tel"
                    placeholder={t.partnerSponsorForm.phonePlaceholder}
                    value={formData.contact_phone}
                    onChange={(e) => update({ contact_phone: e.target.value })}
                    onBlur={() => handleBlur("contact_phone")}
                    className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_phone ? "border-destructive" : ""}`}
                  />
                  <FormFieldError error={errors.contact_phone || null} />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.website}
                </Label>
                <Input
                  placeholder={t.partnerSponsorForm.websitePlaceholder}
                  value={formData.website}
                  onChange={(e) => update({ website: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </motion.div>
          )}

          {/* ============ STEP 2 ============ */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Type of Contribution */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.typeOfContribution} <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">{t.partnerSponsorForm.contributionHint}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CONTRIBUTION_OPTIONS.map((opt) => (
                    <Chip
                      key={opt}
                      active={formData.contribution_types.includes(opt)}
                      onClick={() => toggle("contribution_types", opt)}
                    >
                      {getContributionLabel(opt, t)}
                    </Chip>
                  ))}
                </div>

                {/* Conditional micro-cards */}
                <AnimatePresence>
                  {formData.contribution_types.includes("Financial Sponsorship") && (
                    <MicroCard key="fin" title={t.partnerSponsorForm.contributions.financial}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.finBudgets.label}</Label>
                        <Select value={formData.fin_budget} onValueChange={(v) => update({ fin_budget: v })}>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder={t.partnerSponsorForm.finBudgets.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {FIN_BUDGETS.map((b) => (
                              <SelectItem key={b} value={b}>{getFinBudgetLabel(b, t)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.finVisibilityOptions.label}</Label>
                        <div className="flex flex-wrap gap-2">
                          {FIN_VISIBILITY.map((v) => (
                            <Chip
                              key={v}
                              active={formData.fin_visibility.includes(v)}
                              onClick={() => toggle("fin_visibility", v)}
                            >
                              {getFinVisibilityLabel(v, t)}
                            </Chip>
                          ))}
                          <Chip
                            active={formData.fin_visibility.includes("Other")}
                            onClick={() => toggle("fin_visibility", "Other")}
                          >
                            {t.common.other}
                          </Chip>
                        </div>
                        {formData.fin_visibility.includes("Other") && (
                          <Input
                            placeholder={t.partnerSponsorForm.finVisibilityOptions.otherPlaceholder}
                            value={formData.fin_visibility_other}
                            onChange={(e) => update({ fin_visibility_other: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary mt-2"
                          />
                        )}
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Event Sponsorship") && (
                    <MicroCard key="event" title={t.partnerSponsorForm.contributions.event}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.eventTypes.label}</Label>
                        <div className="flex flex-wrap gap-2">
                          {EVENT_TYPES.map((v) => (
                            <Chip
                              key={v}
                              active={formData.event_types.includes(v)}
                              onClick={() => toggle("event_types", v)}
                            >
                              {getEventTypeLabel(v, t)}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.eventInvolvements.label}</Label>
                        <Select value={formData.event_involvement} onValueChange={(v) => update({ event_involvement: v })}>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder={t.partnerSponsorForm.eventInvolvements.placeholder} />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {EVENT_INVOLVEMENT.map((b) => (
                              <SelectItem key={b} value={b}>{getEventInvolvementLabel(b, t)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Mentorship / Speakers") && (
                    <MicroCard key="mentor" title={t.partnerSponsorForm.contributions.mentorship}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.mentorRoles.label}</Label>
                        <div className="flex flex-wrap gap-2">
                          {MENTOR_PROVIDE.map((v) => (
                            <Chip
                              key={v}
                              active={formData.mentor_roles.includes(v)}
                              onClick={() => toggle("mentor_roles", v)}
                            >
                              {getMentorRoleLabel(v, t)}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.mentorRoles.fieldsTopics}</Label>
                        <Input
                          placeholder={t.partnerSponsorForm.mentorRoles.fieldsPlaceholder}
                          value={formData.mentor_topics}
                          onChange={(e) => update({ mentor_topics: e.target.value })}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Internships / Opportunities") && (
                    <MicroCard key="intern" title={t.partnerSponsorForm.contributions.internships}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.internTypes.label}</Label>
                        <div className="flex flex-wrap gap-2">
                          {INTERN_TYPES.map((v) => (
                            <Chip
                              key={v}
                              active={formData.intern_types.includes(v)}
                              onClick={() => toggle("intern_types", v)}
                            >
                              {getInternTypeLabel(v, t)}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.internFields}</Label>
                          <Input
                            placeholder={t.partnerSponsorForm.internFieldsPlaceholder}
                            value={formData.intern_fields}
                            onChange={(e) => update({ intern_fields: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.internPositions}</Label>
                          <Input
                            type="number"
                            min={1}
                            placeholder={t.partnerSponsorForm.internPositionsPlaceholder}
                            value={formData.intern_positions}
                            onChange={(e) => update({ intern_positions: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary"
                          />
                        </div>
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Resources / Tools") && (
                    <MicroCard key="resources" title={t.partnerSponsorForm.contributions.resources}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.resourceSupport}</Label>
                        <Input
                          placeholder={t.partnerSponsorForm.resourcePlaceholder}
                          value={formData.resource_support}
                          onChange={(e) => update({ resource_support: e.target.value })}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Strategic Partnership") && (
                    <MicroCard key="strategic" title={t.partnerSponsorForm.contributions.strategic}>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">{t.partnerSponsorForm.strategicIdea}</Label>
                        <Textarea
                          placeholder={t.partnerSponsorForm.strategicPlaceholder}
                          value={formData.strategic_idea}
                          onChange={(e) => {
                            if (e.target.value.length <= 400) update({ strategic_idea: e.target.value });
                          }}
                          rows={3}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </MicroCard>
                  )}
                </AnimatePresence>
              </div>

              {/* Target Audience */}
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-muted-foreground" />
                  {t.partnerSponsorForm.targetAudience} <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">{t.partnerSponsorForm.audienceHint}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AUDIENCES.map((a) => (
                    <Chip
                      key={a}
                      active={formData.audiences.includes(a)}
                      onClick={() => toggle("audiences", a)}
                    >
                      {getAudienceLabel(a, t)}
                    </Chip>
                  ))}
                </div>
                {formData.audiences.includes("Specific Fields") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <Input
                      placeholder={t.partnerSponsorForm.specificFieldsPlaceholder}
                      value={formData.audience_fields}
                      onChange={(e) => update({ audience_fields: e.target.value })}
                      className="bg-secondary/50 border-border focus:border-primary mt-2"
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* ============ STEP 3 ============ */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t.partnerSponsorForm.collabVision} <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  {t.partnerSponsorForm.collabHint}
                </p>
                <Textarea
                  placeholder={t.partnerSponsorForm.collabPlaceholder}
                  value={formData.collab_vision}
                  onChange={(e) => {
                    if (e.target.value.length <= 500) update({ collab_vision: e.target.value });
                  }}
                  onBlur={() => handleBlur("collab_vision")}
                  className={`bg-secondary/50 border-border focus:border-primary ${errors.collab_vision ? "border-destructive" : ""}`}
                  rows={4}
                />
                <div className="flex justify-between">
                  <FormFieldError error={errors.collab_vision || null} />
                  <span className="text-xs text-muted-foreground">{formData.collab_vision.length}/500</span>
                </div>
              </div>



              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t.partnerSponsorForm.pastPartnerships} <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 pt-1">
                  {[{ value: "Yes", label: t.common.yes }, { value: "No", label: t.common.no }].map((v) => (
                    <Chip
                      key={v.value}
                      active={formData.prior_partnership === v.value}
                      onClick={() => update({ prior_partnership: v.value, prior_description: v.value === "No" ? "" : formData.prior_description })}
                    >
                      {v.label}
                    </Chip>
                  ))}
                </div>
                <AnimatePresence>
                  {formData.prior_partnership === "Yes" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <Textarea
                        placeholder={t.partnerSponsorForm.pastPartnershipsPlaceholder}
                        value={formData.prior_description}
                        onChange={(e) => {
                          if (e.target.value.length <= 400) update({ prior_description: e.target.value });
                        }}
                        rows={3}
                        className="bg-secondary/50 border-border focus:border-primary mt-2"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">{t.partnerSponsorForm.additionalDetails}</Label>
                <Textarea
                  placeholder={t.partnerSponsorForm.additionalPlaceholder}
                  value={formData.additional_details}
                  onChange={(e) => update({ additional_details: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                  rows={3}
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="partner-consent"
                  checked={formData.consent}
                  onCheckedChange={(v) => update({ consent: v === true })}
                  className="mt-1"
                />
                <Label htmlFor="partner-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                  {t.partnerSponsorForm.consentLabel} <span className="text-destructive">*</span>
                </Label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {submitError && (
          <motion.div
            className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitError}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <HeroButton variant="ghost" size="md" onClick={handleStepBack}>
            <ArrowLeft className="w-4 h-4" />
            {t.common.back}
          </HeroButton>
          {step < 3 ? (
            <HeroButton
              size="md"
              onClick={handleNext}
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
              className={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) ? "opacity-50 cursor-not-allowed" : ""}
            >
              {t.common.next}
              <ArrowRight className="w-4 h-4" />
            </HeroButton>
          ) : (
            <HeroButton
              size="md"
              onClick={handleSubmit}
              disabled={!canSubmit || isSubmitting}
              className={!canSubmit || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.common.submitting}
                </>
              ) : (
                <>
                  {t.common.completeRegistration}
                  <Check className="w-4 h-4" />
                </>
              )}
            </HeroButton>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default PartnerSponsorForm;
