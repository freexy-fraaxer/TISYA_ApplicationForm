import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import MemberStep1Basics from "./member-form-steps/MemberStep1Basics";
import MemberStep2Interests from "./member-form-steps/MemberStep2Interests";
import MemberStep3Finish from "./member-form-steps/MemberStep3Finish";
import MemberSuccessScreen from "./shared/MemberSuccessScreen";
import { validateEmail, validatePhone } from "@/lib/validation";
import { submitToAppsScript } from "@/lib/submitForm";

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

export interface PathfinderFormData {
  // Step 1
  full_name: string;
  email: string;
  contact_number: string;
  city: string;
  nationality: string;
  university: string;
  department_of_study: string;
  
  // Step 2
  attention_reason: string;
  interests: string[];
  social_level: number;
  
  // Step 3
  referral_source: string[];
  source_other: string;
  consent_data_storage: boolean;
  consent_updates: boolean;
  
  // Hidden
  honeypot: string;
}

const initialFormData: PathfinderFormData = {
  full_name: "",
  email: "",
  contact_number: "",
  city: "",
  nationality: "",
  university: "",
  department_of_study: "",
  attention_reason: "",
  interests: [],
  social_level: 3,
  referral_source: [],
  source_other: "",
  consent_data_storage: false,
  consent_updates: false,
  honeypot: "",
};

interface PathfinderFormProps {
  onBack: () => void;
}

const PathfinderForm = ({ onBack }: PathfinderFormProps) => {
  const { playPulse, playBack } = useSound();
  const { triggerPulse } = useBackgroundEffects();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PathfinderFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState<string>("");

  const handleBackToRoles = () => {
    playBack();
    onBack();
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<PathfinderFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (submitError) setSubmitError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.full_name.trim() &&
          formData.email.trim() &&
          validateEmail(formData.email) &&
          formData.contact_number.trim() &&
          validatePhone(formData.contact_number) &&
          formData.nationality.trim() &&
          formData.university.trim()
        );
      case 2:
        return !!(formData.attention_reason && formData.interests.length > 0);
      case 3:
        return formData.consent_data_storage;
      default:
        return true;
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed) {
      playPulse();
      triggerPulse();
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed || formData.honeypot || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const acquisitionChannel = (() => {
      if (formData.referral_source.includes("Other") && formData.source_other.trim()) {
        return formData.source_other.trim();
      }
      if (formData.referral_source.length > 0) {
        return formData.referral_source[0];
      }
      return "";
    })();

    // Keys MUST exactly match MEMBER_FIELDS in the Apps Script
    const fields: Record<string, unknown> = {
      source_form_version: "v2_pathfinder",
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      contact_number: formData.contact_number.trim(),
      city: formData.city.trim(),
      nationality: formData.nationality.trim(),
      university: formData.university.trim(),
      department_of_study: formData.department_of_study.trim(),
      interests: formData.interests,
      attention_reason: formData.attention_reason,
      social_level: formData.social_level,
      acquisition_channel: acquisitionChannel,
      consent_data_storage: formData.consent_data_storage,
      consent_updates: formData.consent_updates,
    };

    try {
      const { generatedId: id } = await submitToAppsScript("Pathfinder", fields);
      setGeneratedId(id);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <MemberSuccessScreen applicationId={generatedId} onBack={onBack} />;
  }

  const stepVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          {currentStep > 1 ? (
            <motion.button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={handlePrev}
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </motion.button>
          ) : <span />}
          <motion.button
            className="p-2 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150"
            onClick={handleBackToRoles}
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

        <FormProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={MEMBER_STEPS}
          completedMicrocopy={MEMBER_MICROCOPY}
        />

        <input
          type="text"
          name="honeypot"
          value={formData.honeypot}
          onChange={(e) => updateFormData({ honeypot: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

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

        {submitError && (
          <motion.div
            className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {submitError}
          </motion.div>
        )}

        <div className="flex justify-end mt-8">
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

export default PathfinderForm;
