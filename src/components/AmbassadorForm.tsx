import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { ArrowLeft, Check, Loader2, User, Mail, Phone, MapPin, Globe, Linkedin } from "lucide-react";
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
import { countries, validateEmail, getEmailError, getRequiredError } from "@/lib/validation";

interface AmbassadorFormProps {
  onBack: () => void;
}

interface AmbassadorFormData {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  linkedin: string;
  previous_involvement: boolean;
  involvement_details: string;
  why_ambassador: string;
  experience: string;
  consent: boolean;
  honeypot: string;
}

const initialData: AmbassadorFormData = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  city: "",
  linkedin: "",
  previous_involvement: false,
  involvement_details: "",
  why_ambassador: "",
  experience: "",
  consent: false,
  honeypot: "",
};

const AmbassadorForm = ({ onBack }: AmbassadorFormProps) => {
  const { playBack } = useSound();
  const [formData, setFormData] = useState<AmbassadorFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const update = (updates: Partial<AmbassadorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  useEffect(() => {
    const e: Record<string, string | null> = {};
    if (touched.full_name) e.full_name = getRequiredError(formData.full_name, "Full name");
    if (touched.email) e.email = getEmailError(formData.email);
    if (touched.phone) e.phone = getRequiredError(formData.phone, "Phone number");
    if (touched.country) e.country = formData.country ? null : "Country is required";
    if (touched.why_ambassador) e.why_ambassador = getRequiredError(formData.why_ambassador, "This field");
    if (touched.experience) e.experience = getRequiredError(formData.experience, "This field");
    setErrors(e);
  }, [formData, touched]);

  const canSubmit =
    formData.full_name.trim() &&
    formData.email.trim() &&
    validateEmail(formData.email) &&
    formData.phone.trim() &&
    formData.country &&
    formData.why_ambassador.trim() &&
    formData.experience.trim() &&
    formData.consent;

  const handleSubmit = async () => {
    if (!canSubmit || formData.honeypot || isSubmitting) return;
    // No backend yet — just show success
    setIsSubmitting(true);
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
          <h2 className="text-2xl font-bold text-foreground mb-4">Application Received!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for your interest in becoming a Country Ambassador. We'll review your application and get back to you soon.
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
        <motion.button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          onClick={handleBack}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to roles</span>
        </motion.button>

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
          <h2 className="text-2xl font-bold text-foreground mb-2">Country Ambassador</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Represent TISYA in your country. As an ambassador, you'll be the local voice of the alliance — organizing events, building networks, and driving impact on the ground.
          </p>
        </div>

        <div className="space-y-5">
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
                Have you previously been involved with TISYA?
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
                    placeholder="Describe your involvement..."
                    value={formData.involvement_details}
                    onChange={(e) => update({ involvement_details: e.target.value })}
                    className="bg-secondary/50 border-border focus:border-primary"
                    rows={3}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Why Ambassador */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Why do you want to become a Country Ambassador? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Share your motivation..."
              value={formData.why_ambassador}
              onChange={(e) => update({ why_ambassador: e.target.value })}
              onBlur={() => handleBlur("why_ambassador")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.why_ambassador ? "border-destructive" : ""}`}
              rows={4}
            />
            <FormFieldError error={errors.why_ambassador || null} />
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              What experience makes you suitable for this role? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Relevant leadership, community, or organizational experience..."
              value={formData.experience}
              onChange={(e) => update({ experience: e.target.value })}
              onBlur={() => handleBlur("experience")}
              className={`bg-secondary/50 border-border focus:border-primary ${errors.experience ? "border-destructive" : ""}`}
              rows={4}
            />
            <FormFieldError error={errors.experience || null} />
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3 pt-2">
            <Checkbox
              id="ambassador-consent"
              checked={formData.consent}
              onCheckedChange={(v) => update({ consent: v === true })}
              className="mt-1"
            />
            <Label htmlFor="ambassador-consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              I consent to TISYA storing my data for the purpose of this application. <span className="text-destructive">*</span>
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
                Submit Application
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
