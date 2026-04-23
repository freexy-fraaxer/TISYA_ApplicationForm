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
  const { playBack } = useSound();
  const [formData, setFormData] = useState<CountryUnionFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
          <h2 className="text-2xl font-bold text-foreground mb-4">Registration Received!</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for registering your organization. Our team will review your submission and reach out to discuss next steps.
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
          <span>Back to paths</span>
        </motion.button>

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
          <h2 className="text-2xl font-bold text-foreground mb-2">Register Your Organization</h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            For country unions, NGOs, academic institutions, and youth organizations seeking structural affiliation with TİSYA. Not a sponsorship form — this is about long-term partnership.
          </p>
        </div>

        <div className="space-y-5">
          {/* Organization Name */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="Your organization's name"
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
                placeholder="City"
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
              Organization Type <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.org_type}
              onValueChange={(v) => {
                update({ org_type: v });
                setTouched((prev) => ({ ...prev, org_type: true }));
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

          {/* Contact Person */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Contact Person Name <span className="text-destructive">*</span>
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
                Contact Email <span className="text-destructive">*</span>
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
                Contact Phone
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
              placeholder="https://yourorganization.org"
              value={formData.website}
              onChange={(e) => update({ website: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          {/* Scope of Work */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Scope of Work</Label>
            <Textarea
              placeholder="What does your organization do? Main activities and focus areas..."
              value={formData.scope_of_work}
              onChange={(e) => update({ scope_of_work: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              rows={4}
            />
          </div>

          {/* Why Affiliate */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Why do you want to affiliate with TİSYA?</Label>
            <Textarea
              placeholder="Share your vision for this affiliation..."
              value={formData.why_affiliate}
              onChange={(e) => update({ why_affiliate: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              rows={4}
            />
          </div>

          {/* Student Challenges - NEW */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              What challenges do students from your country face in Türkiye? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Housing, language barriers, cultural adjustment, lack of community — be real about it."
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
              If approved, what would your first steps be in collaboration with TİSYA? <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Outreach plan, event ideas, community building — what would you do in the first 30 days?"
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
              I consent to TİSYA storing this data for affiliation purposes. <span className="text-destructive">*</span>
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
                Register Organization
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
