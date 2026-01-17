import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import CollabStep1OrgInfo from "./collaborator-form-steps/CollabStep1OrgInfo";
import CollabStep2Type from "./collaborator-form-steps/CollabStep2Type";
import CollabStep3Details from "./collaborator-form-steps/CollabStep3Details";
import CollabStep4Final from "./collaborator-form-steps/CollabStep4Final";
import FormSuccessScreen from "./shared/FormSuccessScreen";

const COLLAB_MICROCOPY = [
  "Great start",
  "Nice selections",
  "Good details",
  "Almost there",
];

export interface CollaboratorFormData {
  // Step 1 - Organization Info
  org_name: string;
  contact_name: string;
  role_title: string;
  email: string;
  website: string;
  location: string;
  org_type: string;

  // Step 2 - Collaboration Type
  collab_type: string[];

  // Step 3 - Conditional Details
  event_name: string;
  event_date: string;
  event_format: string;
  expected_attendance: string;
  target_audience: string;
  event_description: string;
  project_name: string;
  project_summary: string;
  timeline: string;

  // Step 4 - Final Details
  preferred_timeline: string;
  budget_range: string;
  success_definition: string;
  additional_notes: string;
  consent_data_storage: boolean;

  // Hidden
  honeypot: string;
  submission_type: string;
}

const initialFormData: CollaboratorFormData = {
  org_name: "",
  contact_name: "",
  role_title: "",
  email: "",
  website: "",
  location: "",
  org_type: "",
  collab_type: [],
  event_name: "",
  event_date: "",
  event_format: "",
  expected_attendance: "",
  target_audience: "",
  event_description: "",
  project_name: "",
  project_summary: "",
  timeline: "",
  preferred_timeline: "",
  budget_range: "",
  success_definition: "",
  additional_notes: "",
  consent_data_storage: false,
  honeypot: "",
  submission_type: "collaboration",
};

interface CollaboratorFormProps {
  onBack: () => void;
}

const CollaboratorForm = ({ onBack }: CollaboratorFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CollaboratorFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Determine if we need the conditional details step
  const needsDetailsStep = useMemo(() => {
    return (
      formData.collab_type.includes("Event Partnership") ||
      formData.collab_type.includes("Project Collaboration")
    );
  }, [formData.collab_type]);

  const showEventDetails = formData.collab_type.includes("Event Partnership");
  const showProjectDetails = formData.collab_type.includes("Project Collaboration");

  // Calculate total steps (3 or 4 depending on conditional step)
  const totalSteps = needsDetailsStep ? 4 : 3;

  // Map logical step to actual step component
  const getActualStep = (step: number): number => {
    if (!needsDetailsStep && step >= 3) {
      return step + 1; // Skip step 3 (details)
    }
    return step;
  };

  const progress = (currentStep / totalSteps) * 100;

  const updateFormData = (updates: Partial<CollaboratorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    const actualStep = getActualStep(step);
    switch (actualStep) {
      case 1:
        return !!(
          formData.org_name.trim() &&
          formData.contact_name.trim() &&
          formData.email.trim() &&
          formData.email.includes("@")
        );
      case 2:
        return formData.collab_type.length > 0;
      case 3:
        // Conditional details - only validate if shown
        if (!needsDetailsStep) return true;
        return true; // Details are optional
      case 4:
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
      submission_type: "collaboration",
      org_name: formData.org_name,
      contact_name: formData.contact_name,
      role_title: formData.role_title || "",
      email: formData.email,
      website: formData.website || "",
      location: formData.location || "",
      org_type: formData.org_type || "",
      collab_type: formData.collab_type.join(", "),
      event_name: formData.event_name || "",
      event_date: formData.event_date || "",
      event_format: formData.event_format || "",
      expected_attendance: formData.expected_attendance || "",
      target_audience: formData.target_audience || "",
      event_description: formData.event_description || "",
      project_name: formData.project_name || "",
      project_summary: formData.project_summary || "",
      timeline: formData.timeline || "",
      preferred_timeline: formData.preferred_timeline || "",
      budget_range: formData.budget_range || "",
      success_definition: formData.success_definition || "",
      additional_notes: formData.additional_notes || "",
      consent_data_storage: formData.consent_data_storage,
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

      setApplicationId(`COL-${Date.now().toString(36).toUpperCase()}`);
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
        title="Request Submitted"
        subtitle="Thank you for your interest in collaborating with TISYA. We'll review your request and get back to you soon."
        onBack={onBack}
      />
    );
  }

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Render appropriate step content
  const renderStepContent = () => {
    const actualStep = getActualStep(currentStep);
    
    if (currentStep === 1) {
      return <CollabStep1OrgInfo formData={formData} updateFormData={updateFormData} />;
    }
    if (currentStep === 2) {
      return <CollabStep2Type formData={formData} updateFormData={updateFormData} />;
    }
    if (needsDetailsStep && currentStep === 3) {
      return (
        <CollabStep3Details
          formData={formData}
          updateFormData={updateFormData}
          showEventDetails={showEventDetails}
          showProjectDetails={showProjectDetails}
        />
      );
    }
    // Final step
    return <CollabStep4Final formData={formData} updateFormData={updateFormData} />;
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
          steps={
            needsDetailsStep
              ? [
                  { label: "Organization" },
                  { label: "Type" },
                  { label: "Details" },
                  { label: "Final" },
                ]
              : [
                  { label: "Organization" },
                  { label: "Type" },
                  { label: "Final" },
                ]
          }
          completedMicrocopy={COLLAB_MICROCOPY}
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
            {renderStepContent()}
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
                  Submit Collaboration Request
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

export default CollaboratorForm;
