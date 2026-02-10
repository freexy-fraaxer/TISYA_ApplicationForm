import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import MemberStep1Basics from "./member-form-steps/MemberStep1Basics";
import MemberStep2Interests from "./member-form-steps/MemberStep2Interests";
import MemberStep3Finish from "./member-form-steps/MemberStep3Finish";
import MemberSuccessScreen from "./shared/MemberSuccessScreen";
import { validateEmail } from "@/lib/validation";

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbyFACL7DPqft4uRiFAa5xTRfq83OOu1nj9MN-robflqCbYNwAr8Uz6WtDAGFL7mMf5D/exec";

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
  // Step 1 - matching backend field names exactly
  full_name: string;
  email: string;
  contact_number: string;
  city: string;
  nationality: string;
  university: string;
  department_of_study: string;
  
  // Step 2
  interests: string[];
  community_vibe: number;
  
  // Step 3
  referral_source: string[];
  source_other: string;
  consent_data_storage: boolean;
  consent_updates: boolean;
  
  // Hidden
  honeypot: string;
}

const initialFormData: MemberFormData = {
  full_name: "",
  email: "",
  contact_number: "",
  city: "",
  nationality: "",
  university: "",
  department_of_study: "",
  interests: [],
  community_vibe: 50,
  referral_source: [],
  source_other: "",
  consent_data_storage: false,
  consent_updates: false,
  honeypot: "",
};

interface MemberFormProps {
  onBack: () => void;
}

const MemberForm = ({ onBack }: MemberFormProps) => {
  const { playPulse, playBack } = useSound();
  const { triggerPulse } = useBackgroundEffects();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MemberFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBackToRoles = () => {
    playBack();
    onBack();
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<MemberFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear error when user makes changes
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
          formData.nationality.trim() &&
          formData.university.trim()
        );
      case 2:
        return formData.interests.length > 0;
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
    // Prevent duplicate submissions
    if (!canProceed || formData.honeypot || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Determine final source value: if "Other" is selected, use source_other text
    const getFinalSource = () => {
      if (formData.referral_source.includes("Other") && formData.source_other.trim()) {
        return formData.source_other.trim();
      }
      if (formData.referral_source.length > 0) {
        return formData.referral_source[0]; // Single selection
      }
      return null;
    };

    const payload = {
      formType: "member",
      data: {
        Full_Name: formData.full_name,
        Email: formData.email,
        Contact_Number: formData.contact_number,
        City: formData.city || null,
        Nationality: formData.nationality,
        University: formData.university,
        Department_of_Study: formData.department_of_study || null,
        Interests: formData.interests.length > 0 ? formData.interests : null,
        Community_Vibe: formData.community_vibe,
        Source: getFinalSource(),
        Data_Consent: formData.consent_data_storage,
        Updates_Consent: formData.consent_updates,
      },
      details: null,
    };

    console.log("Member form submitting payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      // Check for HTML response (error page)
      const contentType = response.headers.get("content-type");
      const responseText = await response.text();
      
      console.log("Response status:", response.status);
      console.log("Response content-type:", contentType);
      console.log("Response body:", responseText.substring(0, 500));

      // Check if response is HTML (error page) instead of JSON
      if (!contentType?.includes("application/json") && responseText.trim().startsWith("<!")) {
        throw new Error("API returned an error page. Please try again.");
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        throw new Error("Invalid response from server");
      }

      console.log("Parsed result:", result);

      // Handle success: false from backend
      if (!result.success) {
        throw new Error(result.error || result.message || "Submission failed");
      }

      // Backend handles email confirmation - no frontend email sending
      // Members do NOT show referenceId
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <MemberSuccessScreen onBack={onBack} />;
  }

  // Optimized step transitions - opacity only to prevent layout reflow
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
        {/* Back to roles button */}
        <motion.button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          onClick={handleBackToRoles}
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
