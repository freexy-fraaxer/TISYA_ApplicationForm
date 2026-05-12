import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { ArrowLeft, Check, Loader2, Building2, Mail, Phone, Globe, MapPin, User, X } from "lucide-react";
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
import CommitmentModal from "./shared/CommitmentModal";
import { countries, validateEmail, getEmailError, getRequiredError } from "@/lib/validation";
import { submitToAppsScript } from "@/lib/submitForm";
import { useT } from "@/contexts/LanguageContext";

interface CountryUnionFormProps {
  onBack: () => void;
}

interface CountryUnionFormData {
  org_name: string;
  country: string;
  city: string;
  org_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  scope_of_work: string;
  why_affiliate: string;
  student_challenges: string;
  first_steps: string;
  consent_commitment: boolean;
  consent: boolean;
  honeypot: string;
}

const initialData: CountryUnionFormData = {
  org_name: "",
  country: "",
  city: "",
  org_type: "",
  contact_name: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  scope_of_work: "",
  why_affiliate: "",
  student_challenges: "",
  first_steps: "",
  consent_commitment: false,
  consent: false,
  honeypot: "",
};

const ORG_TYPES = [
  "Youth Organization",
  "Union",
  "NGO",
  "Academic Institution",
  "Other",
];

const CountryUnionForm = ({ onBack }: CountryUnionFormProps) => {
  const t = useT();
  const { playBack } = useSound();
  const [formData, setFormData] = useState<CountryUnionFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const update = (updates: Partial<CountryUnionFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const e: Record<string, string | null> = {};
    if (touched.org_name) e.org_name = getRequiredError(formData.org_name, "Organization name");
    if (touched.country) e.country = formData.country ? null : "Country is required";
    if (touched.org_type) e.org_type = formData.org_type ? null : "Organization type is required";
    if (touched.contact_name) e.contact_name = getRequiredError(formData.contact_name, "Contact person name");
    if (touched.contact_email) e.contact_email = getEmailError(formData.contact_email);
    if (touched.student_challenges) e.student_challenges = getRequiredError(formData.student_challenges, "This field");
    if (touched.first_steps) e.first_steps = getRequiredError(formData.first_steps, "This field");
    setErrors(e);
  }, [formData, touched]);

  const canSubmit =
    formData.org_name.trim() &&
    formData.country &&
    formData.org_type &&
    formData.contact_name.trim() &&
    formData.contact_email.trim() &&
    validateEmail(formData.contact_email) &&
    formData.student_challenges.trim() &&
    formData.first_steps.trim() &&
    formData.consent_commitment &&
    formData.consent;

  const handleSubmit = async () => {
    if (!canSubmit || formData.honeypot || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Keys MUST exactly match COUNTRY_UNION_FIELDS in the Apps Script
      const fields: Record<string, unknown> = {
        org_name: formData.org_name.trim(),
        country: formData.country,
        city: formData.city.trim(),
        org_type: formData.org_type,
        contact_name: formData.contact_name.trim(),
        contact_email: formData.contact_email.trim(),
        contact_phone: formData.contact_phone.trim(),
        website: formData.website.trim(),
        scope_of_work: formData.scope_of_work.trim(),
        why_affiliate: formData.why_affiliate.trim(),
        student_challenges: formData.student_challenges.trim(),
        first_steps: formData.first_steps.trim(),
        consent_commitment: formData.consent_commitment,
        consent: formData.consent,
      };
      const { generatedId: id } = await submitToAppsScript("CountryUnion", fields);
      setGeneratedId(id);
      setIsSuccess(true);
    } catch (error) {
      console.error("CountryUnion submission error:", error);
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
          <h2 className="text-2xl font-bold text-foreground mb-4">{t.countryUnionForm.successTitle}</h2>
          <p className="text-muted-foreground mb-6">
            {t.countryUnionForm.successMessage}
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
          {t.common.missionProgress}
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
          <h2 className="text-2xl font-bold text-foreground mb-2">{t.countryUnionForm.title}</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            {t.countryUnionForm.subtitle}
          </p>
        </div>

        <div className="space-y-5">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {t.countryUnionForm.orgName} <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder={t.countryUnionForm.orgNamePlaceholder}
              value={formData.org_name}
              onChange={(e) => update({ org_name: e.target.value })}
              onBlur={() => handleBlur("org_name")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.org_name ? "border-destructive" : ""}`}
            />
            <FormFieldError error={errors.org_name || null} />
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                {t.countryUnionForm.country} <span className="text-destructive">*</span>
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
                {t.countryUnionForm.city}
              </Label>
              <Input
                placeholder={t.countryUnionForm.cityPlaceholder}
                value={formData.city}
                onChange={(e) => update({ city: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Organization Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              {t.countryUnionForm.orgType} <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.org_type}
              onValueChange={(v) => {
                update({ org_type: v });
                setTouched((prev) => ({ ...prev, org_type: true }));
              }}
            >
              <SelectTrigger className={`bg-secondary/50 border-border ${errors.org_type ? "border-destructive" : ""}`}>
                <SelectValue placeholder={t.countryUnionForm.orgTypePlaceholder} />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {ORG_TYPES.map((typeVal) => (
                  <SelectItem key={typeVal} value={typeVal}>
                    {typeVal === "Youth Organization" ? t.countryUnionForm.orgTypes.youthOrg : 
                     typeVal === "Union" ? t.countryUnionForm.orgTypes.union :
                     typeVal === "NGO" ? t.countryUnionForm.orgTypes.ngo :
                     typeVal === "Academic Institution" ? t.countryUnionForm.orgTypes.academicInst :
                     t.countryUnionForm.orgTypes.other}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormFieldError error={errors.org_type || null} />
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              {t.countryUnionForm.contactName} <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder={t.countryUnionForm.contactNamePlaceholder}
              value={formData.contact_name}
              onChange={(e) => update({ contact_name: e.target.value })}
              onBlur={() => handleBlur("contact_name")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_name ? "border-destructive" : ""}`}
            />
            <FormFieldError error={errors.contact_name || null} />
          </div>

          {/* Contact Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                {t.countryUnionForm.contactEmail} <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                placeholder={t.countryUnionForm.contactEmailPlaceholder}
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
                {t.countryUnionForm.contactPhone}
              </Label>
              <Input
                type="tel"
                placeholder={t.countryUnionForm.contactPhonePlaceholder}
                value={formData.contact_phone}
                onChange={(e) => update({ contact_phone: e.target.value })}
                className="bg-secondary/50 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              {t.countryUnionForm.website}
            </Label>
            <Input
              placeholder={t.countryUnionForm.websitePlaceholder}
              value={formData.website}
              onChange={(e) => update({ website: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          {/* Scope of Work */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.countryUnionForm.scopeOfWork}</Label>
            <Textarea
              placeholder={t.countryUnionForm.scopeOfWorkPlaceholder}
              value={formData.scope_of_work}
              onChange={(e) => update({ scope_of_work: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              rows={4}
            />
          </div>

          {/* Why Affiliate */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t.countryUnionForm.whyAffiliate}</Label>
            <Textarea
              placeholder={t.countryUnionForm.whyAffiliatePlaceholder}
              value={formData.why_affiliate}
              onChange={(e) => update({ why_affiliate: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              rows={4}
            />
          </div>

          {/* Student Challenges - NEW */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t.countryUnionForm.studentChallenges} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder={t.countryUnionForm.studentChallengesPlaceholder}
              value={formData.student_challenges}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  update({ student_challenges: e.target.value });
                }
              }}
              onBlur={() => handleBlur("student_challenges")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.student_challenges ? "border-destructive" : ""}`}
              rows={4}
            />
            <div className="flex justify-between">
              <FormFieldError error={errors.student_challenges || null} />
              <span className="text-xs text-muted-foreground">{formData.student_challenges.length}/500</span>
            </div>
          </div>

          {/* First Steps - NEW */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              {t.countryUnionForm.firstSteps} <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder={t.countryUnionForm.firstStepsPlaceholder}
              value={formData.first_steps}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  update({ first_steps: e.target.value });
                }
              }}
              onBlur={() => handleBlur("first_steps")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.first_steps ? "border-destructive" : ""}`}
              rows={4}
            />
            <div className="flex justify-between">
              <FormFieldError error={errors.first_steps || null} />
              <span className="text-xs text-muted-foreground">{formData.first_steps.length}/500</span>
            </div>
          </div>

          {/* Commitment Checkbox */}
          <CommitmentModal
            roleName="Country Union"
            checked={formData.consent_commitment}
            onCheckedChange={(checked) => update({ consent_commitment: checked })}
          />

          {/* Data Consent */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="union-consent"
              checked={formData.consent}
              onCheckedChange={(v) => update({ consent: v === true })}
              className="mt-1"
            />
            <Label htmlFor="union-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              {t.countryUnionForm.consentLabel} <span className="text-destructive">*</span>
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
            {t.common.back}
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
                {t.common.submitting}
              </>
            ) : (
              <>
                {t.common.submit}
                <Check className="w-4 h-4" />
              </>
            )}
          </HeroButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default CountryUnionForm;
