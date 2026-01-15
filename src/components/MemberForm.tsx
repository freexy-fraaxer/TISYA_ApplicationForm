import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import MemberStep1Basics from "./member-form-steps/MemberStep1Basics";
import MemberStep2Interests from "./member-form-steps/MemberStep2Interests";
import MemberStep3Finish from "./member-form-steps/MemberStep3Finish";
import FormSuccessScreen from "./shared/FormSuccessScreen";

const MEMBER_STEPS = [
  { label: "Basics" },
  { label: "Your Vibe" },
  { label: "Final Touch" },
];

const MEMBER_MICROCOPY = [
  "Nice to meet you",
  "Great picks",
  "Almost there",
];
export interface MemberFormData {
  // Step 1
  full_name: string;
  email: string;
  nationality: string;
  university: string;
  
  // Step 2
  interest_zones: string[];
  community_vibe: number;
  motivation: string[];
  
  // Step 3
  contact_channels: string[];
  consent_data_storage: boolean;
  consent_updates: boolean;
  
  // Hidden
  honeypot: string;
  submission_type: string;
}

const initialFormData: MemberFormData = {
  full_name: "",
  email: "",
  nationality: "",
  university: "",
  interest_zones: [],
  community_vibe: 50,
  motivation: [],
  contact_channels: [],
  consent_data_storage: false,
  consent_updates: false,
  honeypot: "",
  submission_type: "member",
};

interface MemberFormProps {
  onBack: () => void;
}

const MemberForm = ({ onBack }: MemberFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<MemberFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.full_name.trim() &&
          formData.email.trim() &&
          formData.email.includes("@")
        );
      case 2:
        return formData.interest_zones.length > 0;
      case 3:
        return formData.consent_data_storage;
      default:
        return true;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed || formData.honeypot) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const params = new URLSearchParams(window.location.search);

    const payload = {
      timestamp: new Date().toISOString(),
      submission_type: "member",
      full_name: formData.full_name,
      email: formData.email,
      nationality: formData.nationality || "",
      university: formData.university || "",
      interest_zones: formData.interest_zones.join(", "),
      community_vibe: formData.community_vibe,
      motivation: formData.motivation.join(", "),
      contact_channels: formData.contact_channels.join(", "),
      consent_data_storage: formData.consent_data_storage,
      consent_updates: formData.consent_updates,
      honeypot: formData.honeypot,
      source: "lovable_form",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbyrUnVVukfmZKrL4WLE0KPVK5ytcILxjhtl9-TvsX4IQ2EqVPfGEBmzA2mlu5mAkrF4/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify(payload),
        }
      );

      setApplicationId(`PTH-${Date.now().toString(36).toUpperCase()}`);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <FormSuccessScreen
        applicationId={applicationId || ""}
        title="Welcome, Pathfinder"
        subtitle="You're now part of the community. We'll be in touch soon."
        onBack={onBack}
      />
    );
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="w-full max-w-2xl p-6 md:p-8"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Back to roles button */}
        <motion.button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          onClick={onBack}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to roles</span>
        </motion.button>

        {/* Progress Section */}
        <FormProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={MEMBER_STEPS}
          completedMicrocopy={MEMBER_MICROCOPY}
        />

        {/* Hidden honeypot field */}
        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => updateFormData({ honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Form Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <MemberStep1Basics formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <MemberStep2Interests formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <MemberStep3Finish formData={formData} updateFormData={updateFormData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Error message */}
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
          <HeroButton
            variant="ghost"
            size="md"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </HeroButton>

          {currentStep < totalSteps ? (
            <HeroButton
              size="md"
              onClick={handleNext}
              disabled={!canProceed}
              className={!canProceed ? "opacity-50 cursor-not-allowed" : ""}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </HeroButton>
          ) : (
            <HeroButton
              size="md"
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className={!canProceed || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Join as Pathfinder
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

export default MemberForm;
