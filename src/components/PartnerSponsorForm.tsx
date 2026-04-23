import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { ArrowLeft, Check, Loader2, Building2, Mail, Phone, Globe, User, X } from "lucide-react";
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

interface PartnerSponsorFormProps {
  onBack: () => void;
}

interface PartnerFormData {
  org_name: string;
  org_type: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  partnership_interest: string;
  how_support: string;
  message: string;
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
  partnership_interest: "",
  how_support: "",
  message: "",
  consent: false,
  honeypot: "",
};

const ORG_TYPES = [
  "Corporate / Company",
  "NGO / Non-Profit",
  "Academic Institution",
  "Media Organization",
  "Government Body",
  "Individual Sponsor",
  "Other",
];

const PARTNERSHIP_INTERESTS = [
  "Event Sponsorship",
  "Program Partnership",
  "Resource Sharing",
  "Mentorship Partnership",
  "Media / Visibility Partnership",
  "Financial Support",
  "Other",
];

const PartnerSponsorForm = ({ onBack }: PartnerSponsorFormProps) => {
  const { playBack } = useSound();
  const [formData, setFormData] = useState<PartnerFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const update = (updates: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const e: Record<string, string | null> = {};
    if (touched.org_name) e.org_name = getRequiredError(formData.org_name, "Organization name");
    if (touched.contact_name) e.contact_name = getRequiredError(formData.contact_name, "Contact name");
    if (touched.contact_email) e.contact_email = getEmailError(formData.contact_email);
    if (touched.how_support) e.how_support = getRequiredError(formData.how_support, "This field");
    setErrors(e);
  }, [formData, touched]);

  const canSubmit =
    formData.org_name.trim() &&
    formData.contact_name.trim() &&
    formData.contact_email.trim() &&
    validateEmail(formData.contact_email) &&
    formData.how_support.trim() &&
    formData.consent;

  const handleSubmit = async () => {
    if (!canSubmit || formData.honeypot || isSubmitting) return;
    setIsSubmitting(true);
    // TODO: Wire to actual endpoint
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
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
          <p className="text-muted-foreground mb-8">
            We'll review your inquiry and reach out to discuss collaboration opportunities.
          </p>
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
            Mission Progress: Step 1 of 1
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2">Partner / Sponsor</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Collaborate with TISYA as an organization or sponsor. Tell us about your vision.
          </p>
        </div>

        <div className="space-y-5">
          {/* Org Name */}
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

          {/* Org Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Organization Type
            </Label>
            <Select value={formData.org_type} onValueChange={(v) => update({ org_type: v })}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {ORG_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Contact Name */}
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

          {/* Contact Email & Phone */}
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

          {/* Website */}
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

          {/* Partnership Interest */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Partnership Interest</Label>
            <Select value={formData.partnership_interest} onValueChange={(v) => update({ partnership_interest: v })}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="What type of partnership?" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {PARTNERSHIP_INTERESTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* How Support */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              How would you like to support or collaborate with TISYA? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Tell us your vision for this partnership — what you can bring and what you hope to achieve."
              value={formData.how_support}
              onChange={(e) => {
                if (e.target.value.length <= 500) update({ how_support: e.target.value });
              }}
              onBlur={() => handleBlur("how_support")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.how_support ? "border-destructive" : ""}`}
              rows={4}
            />
            <div className="flex justify-between">
              <FormFieldError error={errors.how_support || null} />
              <span className="text-xs text-muted-foreground">{formData.how_support.length}/500</span>
            </div>
          </div>

          {/* Additional Message */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Anything else?</Label>
            <Textarea
              placeholder="Additional context, questions, or ideas..."
              value={formData.message}
              onChange={(e) => update({ message: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              rows={3}
            />
          </div>

          {/* Consent */}
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
        </div>

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

export default PartnerSponsorForm;
