import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { ArrowLeft, Check, Loader2, User, Mail, Phone, MapPin, Globe, Linkedin, X } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FormFieldError from "./shared/FormFieldError";
import CommitmentModal from "./shared/CommitmentModal";
import HelperText from "./shared/HelperText";
import { cn } from "@/lib/utils";
import { countries, validateEmail, getEmailError, getRequiredError } from "@/lib/validation";
import { submitToAppsScript } from "@/lib/submitForm";

interface AmbassadorFormProps {
  onBack: () => void;
}

const ambassadorTypes = [
  "Country Ambassador",
  "Campus Ambassador",
  "Regional Ambassador",
  "Community Ambassador",
];

const reachOptions = [
  "University students",
  "International students",
  "Student communities",
  "NGOs / organizations",
  "Event organizers / spaces",
];

const presenceOptions = [
  "I create content",
  "I speak / present",
  "I organize people",
  "I connect people",
  "I don't yet, but want to",
];

const dynamicWhyQuestions: Record<string, string> = {
  "Country Ambassador": "How would you bring together students from your country in Türkiye under TİSYA?",
  "Campus Ambassador": "How would you introduce TİSYA in your university?",
  "Regional Ambassador": "How would you build a TİSYA presence in your city?",
  "Community Ambassador": "How would you connect your existing community with TİSYA?",
};

interface AmbassadorFormData {
  ambassador_type: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  institution: string;
  linkedin: string;
  previous_involvement: boolean;
  involvement_details: string;
  reach_network: string[];
  presence: string[];
  why_ambassador: string;
  experience: string;
  consent_commitment: boolean;
  consent: boolean;
  honeypot: string;
}

const initialData: AmbassadorFormData = {
  ambassador_type: "",
  full_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  institution: "",
  linkedin: "",
  previous_involvement: false,
  involvement_details: "",
  reach_network: [],
  presence: [],
  why_ambassador: "",
  experience: "",
  consent_commitment: false,
  consent: false,
  honeypot: "",
};

const AmbassadorForm = ({ onBack }: AmbassadorFormProps) => {
  const { playBack, playTick } = useSound();
  const [formData, setFormData] = useState<AmbassadorFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const update = (updates: Partial<AmbassadorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const toggleChip = (field: "reach_network" | "presence", value: string) => {
    playTick();
    const current = formData[field];
    if (current.includes(value)) {
      update({ [field]: current.filter((v) => v !== value) });
    } else {
      update({ [field]: [...current, value] });
    }
  };

  useEffect(() => {
    const e: Record<string, string | null> = {};
    if (touched.ambassador_type) e.ambassador_type = formData.ambassador_type ? null : "Ambassador type is required";
    if (touched.full_name) e.full_name = getRequiredError(formData.full_name, "Full name");
    if (touched.email) e.email = getEmailError(formData.email);
    if (touched.phone) e.phone = getRequiredError(formData.phone, "Phone number");
    if (touched.country) e.country = formData.country ? null : "Country is required";
    if (touched.why_ambassador) e.why_ambassador = getRequiredError(formData.why_ambassador, "This field");
    if (touched.experience) e.experience = getRequiredError(formData.experience, "This field");
    setErrors(e);
  }, [formData, touched]);

  const canSubmit =
    formData.ambassador_type &&
    formData.full_name.trim() &&
    formData.email.trim() &&
    validateEmail(formData.email) &&
    formData.phone.trim() &&
    formData.country &&
    formData.why_ambassador.trim() &&
    formData.experience.trim() &&
    formData.consent_commitment &&
    formData.consent;

  const handleSubmit = async () => {
    if (!canSubmit || formData.honeypot || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const fields = {
        Full_Name: formData.full_name.trim(),
        Email: formData.email.trim(),
        Contact_Number: formData.phone.trim(),
        City: formData.city.trim(),
        Nationality: formData.country,
        University: formData.institution.trim(),
        Department_of_Study: "",
        ambassador_type: formData.ambassador_type,
        linkedin: formData.linkedin.trim(),
        previous_involvement: formData.previous_involvement,
        involvement_details: formData.involvement_details.trim(),
        reach_network: formData.reach_network,
        presence: formData.presence,
        why_ambassador: formData.why_ambassador.trim(),
        experience: formData.experience.trim(),
        consent_commitment: formData.consent_commitment,
        Data_Consent: formData.consent,
      };
      const { generatedId: id } = await submitToAppsScript("Ambassador", fields);
      setGeneratedId(id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Ambassador submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    playBack();
    onBack();
  };

  const whyQuestion = dynamicWhyQuestions[formData.ambassador_type] || "Why do you want to become an Ambassador?";

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
          <h2 className="text-2xl font-bold text-foreground mb-4">Application Received!</h2>
          <p className="text-muted-foreground mb-6">
            Thank you for stepping up as an Ambassador. We'll review your application and get back to you soon.
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

        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-4 text-center">
          Mission Progress
        </p>

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
          <h2 className="text-2xl font-bold text-foreground mb-2">Become an Ambassador</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Ambassadors represent TİSYA within a defined scope — a country, campus, region, or community. Pick your lane and show us what you've got.
          </p>
        </div>

        <div className="space-y-5">
          {/* Ambassador Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Ambassador Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.ambassador_type}
              onValueChange={(v) => {
                update({ ambassador_type: v, why_ambassador: "" });
                setTouched((prev) => ({ ...prev, ambassador_type: true }));
              }}
            >
              <SelectTrigger className={`bg-secondary/50 border-border ${errors.ambassador_type ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select ambassador type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {ambassadorTypes.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={errors.ambassador_type || null} />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Your full name"
              value={formData.full_name}
              onChange={(e) => update({ full_name: e.target.value })}
              onBlur={() => handleBlur("full_name")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.full_name ? "border-destructive" : ""}`}
            />
            <FormFieldError error={errors.full_name || null} />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              type="email"
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) => update({ email: e.target.value })}
              onBlur={() => handleBlur("email")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.email ? "border-destructive" : ""}`}
            />
            <FormFieldError error={errors.email || null} />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone Number <span className="text-destructive">*</span>
            </Label>
            <Input
              type="tel"
              placeholder="+1 234 567 8900"
              value={formData.phone}
              onChange={(e) => update({ phone: e.target.value })}
              onBlur={() => handleBlur("phone")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.phone ? "border-destructive" : ""}`}
            />
            <FormFieldError error={errors.phone || null} />
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                Country <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.country}
                onValueChange={(v) => {
                  update({ country: v });
                  setTouched((prev) => ({ ...prev, country: true }));
                }}
              >
                <SelectTrigger className={`bg-secondary/50 border-border ${errors.country ? "border-destructive" : ""}`}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border max-h-60">
                  {countries.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormFieldError error={errors.country || null} />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                City
              </Label>
              <Input
                placeholder="Your city"
                value={formData.city}
                onChange={(e) => update({ city: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Institution - conditional */}
          <AnimatePresence>
            {["Campus Ambassador", "Community Ambassador"].includes(formData.ambassador_type) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden space-y-2"
              >
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  {formData.ambassador_type === "Campus Ambassador" ? "University / Institution" : "Organization / Community"}
                </Label>
                <Input
                  placeholder={formData.ambassador_type === "Campus Ambassador" ? "e.g. Istanbul University" : "e.g. Local Youth Council"}
                  value={formData.institution}
                  onChange={(e) => update({ institution: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* LinkedIn */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Linkedin className="w-4 h-4 text-muted-foreground" />
              LinkedIn Profile
            </Label>
            <Input
              placeholder="https://linkedin.com/in/yourprofile"
              value={formData.linkedin}
              onChange={(e) => update({ linkedin: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          {/* Previous Involvement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Have you been involved with TİSYA before?
              </Label>
              <Switch
                checked={formData.previous_involvement}
                onCheckedChange={(v) => update({ previous_involvement: v })}
              />
            </div>
            <AnimatePresence>
              {formData.previous_involvement && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Textarea
                    placeholder="Tell us what you did..."
                    value={formData.involvement_details}
                    onChange={(e) => update({ involvement_details: e.target.value })}
                    className="bg-secondary/50 border-border focus:border-primary"
                    rows={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Your Reach & Network */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Who do you have access to?
            </Label>
            <HelperText>Pick all that apply — this helps us understand your reach.</HelperText>
            <div className="flex flex-wrap gap-2">
              {reachOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleChip("reach_network", option)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300",
                    formData.reach_network.includes(option)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Your Presence */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              How do you usually engage with people?
            </Label>
            <HelperText>No wrong answer — we want to know your style.</HelperText>
            <div className="flex flex-wrap gap-2">
              {presenceOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleChip("presence", option)}
                  className={cn(
                    "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-300",
                    formData.presence.includes(option)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Why Question */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {whyQuestion} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Be specific — we love real answers over polished ones."
              value={formData.why_ambassador}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  update({ why_ambassador: e.target.value });
                }
              }}
              onBlur={() => handleBlur("why_ambassador")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.why_ambassador ? "border-destructive" : ""}`}
              rows={4}
            />
            <div className="flex justify-between">
              <FormFieldError error={errors.why_ambassador || null} />
              <span className="text-xs text-muted-foreground">{formData.why_ambassador.length}/500</span>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              What experience makes you right for this? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Leadership, community work, events you've run — anything relevant."
              value={formData.experience}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  update({ experience: e.target.value });
                }
              }}
              onBlur={() => handleBlur("experience")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.experience ? "border-destructive" : ""}`}
              rows={4}
            />
            <div className="flex justify-between">
              <FormFieldError error={errors.experience || null} />
              <span className="text-xs text-muted-foreground">{formData.experience.length}/500</span>
            </div>
          </div>

          {/* Commitment Checkbox */}
          <CommitmentModal
            roleName="Ambassador"
            checked={formData.consent_commitment}
            onCheckedChange={(checked) => update({ consent_commitment: checked })}
          />

          {/* Data Consent */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="ambassador-consent"
              checked={formData.consent}
              onCheckedChange={(v) => update({ consent: v === true })}
              className="mt-1"
            />
            <Label htmlFor="ambassador-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I consent to TİSYA storing my data for this application. <span className="text-destructive">*</span>
            </Label>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-between mt-8">
          <HeroButton variant="ghost" size="md" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </HeroButton>
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
        </div>
      </GlassCard>
    </div>
  );
};

export default AmbassadorForm;
