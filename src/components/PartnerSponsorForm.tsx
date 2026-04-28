import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
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
import { validateEmail, getEmailError, getRequiredError } from "@/lib/validation";
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
  const { playBack } = useSound();
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
    if (touched.collab_vision) e.collab_vision = getRequiredError(formData.collab_vision, "This field");
    if (touched.why_tisya) e.why_tisya = getRequiredError(formData.why_tisya, "This field");
    setErrors(e);
  }, [formData, touched]);

  const step1Valid =
    formData.org_name.trim() &&
    formData.org_type.trim() &&
    formData.contact_name.trim() &&
    formData.contact_email.trim() &&
    validateEmail(formData.contact_email);

  const step2Valid = formData.contribution_types.length > 0 && formData.audiences.length > 0;

  const canSubmit =
    step1Valid &&
    step2Valid &&
    formData.collab_vision.trim() &&
    formData.why_tisya.trim() &&
    formData.prior_partnership &&
    formData.consent;

  const handleNext = () => {
    if (step === 1) {
      setTouched((p) => ({ ...p, org_name: true, org_type: true, contact_name: true, contact_email: true }));
      if (!step1Valid) return;
    }
    if (step === 2 && !step2Valid) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const handleStepBack = () => {
    if (step === 1) {
      handleBack();
      return;
    }
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setTouched((p) => ({ ...p, collab_vision: true, why_tisya: true }));
    if (!canSubmit || formData.honeypot || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const fields = {
      "Organization Name": formData.org_name.trim(),
      "Partnership Type": formData.contribution_types.join(", "),
      Website: formData.website.trim(),
      Full_Name: formData.contact_name.trim(),
      Email: formData.contact_email.trim(),
      Contact_Number: formData.contact_phone.trim(),
      org_type: formData.org_type,
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
      intern_positions: formData.intern_positions.trim(),
      resource_support: formData.resource_support.trim(),
      strategic_idea: formData.strategic_idea.trim(),
      audiences: formData.audiences,
      audience_fields: formData.audience_fields.trim(),
      collab_vision: formData.collab_vision.trim(),
      why_tisya: formData.why_tisya.trim(),
      prior_partnership: formData.prior_partnership === "Yes",
      prior_description: formData.prior_description.trim(),
      additional_details: formData.additional_details.trim(),
      Data_Consent: formData.consent === true,
    };

    try {
      const { generatedId: id } = await submitToAppsScript("Collaborator", fields);
      setGeneratedId(id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Partner submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    playBack();
    onBack();
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
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to TISYA</h2>
          <p className="text-lg text-primary/80 font-medium mb-4">You are now part of The Alliance</p>
          <p className="text-muted-foreground mb-2 text-sm">Path: Partner / Sponsor</p>
          <p className="text-muted-foreground mb-6">
            We'll review your inquiry and reach out to discuss collaboration opportunities.
          </p>
          {generatedId && (
            <div className="glass-card p-4 mb-8">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">
                Your Reference ID
              </span>
              <p className="text-lg font-mono text-primary font-semibold">{generatedId}</p>
            </div>
          )}
          <HeroButton onClick={handleBack} variant="secondary">Back to Home</HeroButton>
        </GlassCard>
      </div>
    );
  }

  const sectionTitle =
    step === 1 ? "Organization Info" : step === 2 ? "Partnership Details" : "Strategic Fit";

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
            Mission Progress: Step {step} of 3 — {sectionTitle}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2">Partner / Sponsor</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Collaborate with TISYA as an organization or sponsor. Tell us about your vision.
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
                  Organization Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Your organization"
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
                  Organization Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.org_type}
                  onValueChange={(v) => {
                    update({ org_type: v });
                    setTouched((p) => ({ ...p, org_type: true }));
                  }}
                >
                  <SelectTrigger className={`bg-secondary/50 border-border ${errors.org_type ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {ORG_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormFieldError error={errors.org_type || null} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  Contact Person <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Primary contact name"
                  value={formData.contact_name}
                  onChange={(e) => update({ contact_name: e.target.value })}
                  onBlur={() => handleBlur("contact_name")}
                  className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_name ? "border-destructive" : ""}`}
                />
                <FormFieldError error={errors.contact_name || null} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="contact@org.com"
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
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={formData.contact_phone}
                    onChange={(e) => update({ contact_phone: e.target.value })}
                    className="bg-secondary/50 border-border focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  Website
                </Label>
                <Input
                  placeholder="https://yourorg.com"
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
                  Type of Contribution <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">Select all that apply</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CONTRIBUTION_OPTIONS.map((opt) => (
                    <Chip
                      key={opt}
                      active={formData.contribution_types.includes(opt)}
                      onClick={() => toggle("contribution_types", opt)}
                    >
                      {opt}
                    </Chip>
                  ))}
                </div>

                {/* Conditional micro-cards */}
                <AnimatePresence>
                  {formData.contribution_types.includes("Financial Sponsorship") && (
                    <MicroCard key="fin" title="Financial Sponsorship">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Estimated Budget</Label>
                        <Select value={formData.fin_budget} onValueChange={(v) => update({ fin_budget: v })}>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {FIN_BUDGETS.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Preferred Visibility</Label>
                        <div className="flex flex-wrap gap-2">
                          {FIN_VISIBILITY.map((v) => (
                            <Chip
                              key={v}
                              active={formData.fin_visibility.includes(v)}
                              onClick={() => toggle("fin_visibility", v)}
                            >
                              {v}
                            </Chip>
                          ))}
                          <Chip
                            active={formData.fin_visibility.includes("Other")}
                            onClick={() => toggle("fin_visibility", "Other")}
                          >
                            Other
                          </Chip>
                        </div>
                        {formData.fin_visibility.includes("Other") && (
                          <Input
                            placeholder="Specify other visibility..."
                            value={formData.fin_visibility_other}
                            onChange={(e) => update({ fin_visibility_other: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary mt-2"
                          />
                        )}
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Event Sponsorship") && (
                    <MicroCard key="event" title="Event Sponsorship">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Type of Events</Label>
                        <div className="flex flex-wrap gap-2">
                          {EVENT_TYPES.map((v) => (
                            <Chip
                              key={v}
                              active={formData.event_types.includes(v)}
                              onClick={() => toggle("event_types", v)}
                            >
                              {v}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Level of Involvement</Label>
                        <Select value={formData.event_involvement} onValueChange={(v) => update({ event_involvement: v })}>
                          <SelectTrigger className="bg-secondary/50 border-border">
                            <SelectValue placeholder="Select involvement" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {EVENT_INVOLVEMENT.map((b) => (
                              <SelectItem key={b} value={b}>{b}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Mentorship / Speakers") && (
                    <MicroCard key="mentor" title="Mentorship / Speakers">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">What can you provide?</Label>
                        <div className="flex flex-wrap gap-2">
                          {MENTOR_PROVIDE.map((v) => (
                            <Chip
                              key={v}
                              active={formData.mentor_roles.includes(v)}
                              onClick={() => toggle("mentor_roles", v)}
                            >
                              {v}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Fields / Topics</Label>
                        <Input
                          placeholder="e.g., AI, design, entrepreneurship"
                          value={formData.mentor_topics}
                          onChange={(e) => update({ mentor_topics: e.target.value })}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Internships / Opportunities") && (
                    <MicroCard key="intern" title="Internships / Opportunities">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <div className="flex flex-wrap gap-2">
                          {INTERN_TYPES.map((v) => (
                            <Chip
                              key={v}
                              active={formData.intern_types.includes(v)}
                              onClick={() => toggle("intern_types", v)}
                            >
                              {v}
                            </Chip>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Fields / Roles</Label>
                          <Input
                            placeholder="e.g., engineering, marketing"
                            value={formData.intern_fields}
                            onChange={(e) => update({ intern_fields: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Approx. positions</Label>
                          <Input
                            type="number"
                            min={1}
                            placeholder="e.g., 5"
                            value={formData.intern_positions}
                            onChange={(e) => update({ intern_positions: e.target.value })}
                            className="bg-secondary/50 border-border focus:border-primary"
                          />
                        </div>
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Resources / Tools") && (
                    <MicroCard key="resources" title="Resources / Tools">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Type of support</Label>
                        <Input
                          placeholder="e.g., software, platforms, access, credits"
                          value={formData.resource_support}
                          onChange={(e) => update({ resource_support: e.target.value })}
                          className="bg-secondary/50 border-border focus:border-primary"
                        />
                      </div>
                    </MicroCard>
                  )}

                  {formData.contribution_types.includes("Strategic Partnership") && (
                    <MicroCard key="strategic" title="Strategic Partnership">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Brief description of partnership idea</Label>
                        <Textarea
                          placeholder="Share your partnership idea..."
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
                  Target Audience Alignment <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">Who are you looking to reach?</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AUDIENCES.map((a) => (
                    <Chip
                      key={a}
                      active={formData.audiences.includes(a)}
                      onClick={() => toggle("audiences", a)}
                    >
                      {a}
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
                      placeholder="Which specific fields?"
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
                  How do you envision collaborating with TISYA? <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  Describe the value you aim to bring and what outcomes you're looking to achieve.
                </p>
                <Textarea
                  placeholder="Your vision for this collaboration..."
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
                  Why TISYA? <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="What draws you to TISYA specifically?"
                  value={formData.why_tisya}
                  onChange={(e) => {
                    if (e.target.value.length <= 250) update({ why_tisya: e.target.value });
                  }}
                  onBlur={() => handleBlur("why_tisya")}
                  className={`bg-secondary/50 border-border focus:border-primary ${errors.why_tisya ? "border-destructive" : ""}`}
                  rows={3}
                />
                <div className="flex justify-between">
                  <FormFieldError error={errors.why_tisya || null} />
                  <span className="text-xs text-muted-foreground">{formData.why_tisya.length}/250</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Have you partnered with student organizations before? <span className="text-destructive">*</span>
                </Label>
                <div className="flex gap-2 pt-1">
                  {["Yes", "No"].map((v) => (
                    <Chip
                      key={v}
                      active={formData.prior_partnership === v}
                      onClick={() => update({ prior_partnership: v, prior_description: v === "No" ? "" : formData.prior_description })}
                    >
                      {v}
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
                        placeholder="Briefly describe your past partnerships"
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
                <Label className="text-sm font-medium">Additional details or specific ideas (optional)</Label>
                <Textarea
                  placeholder="Anything else you'd like to share..."
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
                  I consent to TISYA storing this data for partnership purposes. <span className="text-destructive">*</span>
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
            Back
          </HeroButton>
          {step < 3 ? (
            <HeroButton
              size="md"
              onClick={handleNext}
              disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid)}
              className={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next
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
                  Submitting...
                </>
              ) : (
                <>
                  Complete Registration
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
