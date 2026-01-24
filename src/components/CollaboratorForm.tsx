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

  // Event Partner
  event_name: string;
  event_date: string;
  event_format: string;
  expected_attendance: string;
  target_audience: string;
  event_description: string;
  
  // Project Partner
  project_name: string;
  project_summary: string;
  timeline: string;
  project_goals: string;
  
  // Speaker Partner
  speaker_direction: string;
  speaker_name: string;
  speaker_topic: string;
  speaker_profile_link: string;
  requested_topic: string;
  number_of_speakers: string;
  
  // Media Partner
  media_type: string[];
  platforms: string[];
  deliverables: string;
  posting_timeline: string;
  audience_reach: string;
  past_work_link: string;
  
  // Sponsor
  sponsorship_type: string[];
  estimated_budget: string;
  what_they_provide: string;
  what_they_expect: string;
  brand_exposure: string;
  
  // Other
  collab_description: string;
  expectations: string;
  notes: string;

  // Step Final
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
  project_goals: "",
  speaker_direction: "",
  speaker_name: "",
  speaker_topic: "",
  speaker_profile_link: "",
  requested_topic: "",
  number_of_speakers: "",
  media_type: [],
  platforms: [],
  deliverables: "",
  posting_timeline: "",
  audience_reach: "",
  past_work_link: "",
  sponsorship_type: [],
  estimated_budget: "",
  what_they_provide: "",
  what_they_expect: "",
  brand_exposure: "",
  collab_description: "",
  expectations: "",
  notes: "",
  preferred_timeline: "",
  budget_range: "",
  success_definition: "",
  additional_notes: "",
  consent_data_storage: false,
  honeypot: "",
  submission_type: "collaborator",
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

  const needsDetailsStep = useMemo(() => {
    return formData.collab_type.length > 0;
  }, [formData.collab_type]);

  const totalSteps = needsDetailsStep ? 4 : 3;

  const updateFormData = (updates: Partial<CollaboratorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
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
        if (!needsDetailsStep) return formData.consent_data_storage;
        return true;
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
      formType: "collaborator",
      timestamp: new Date().toISOString(),
      data: {
        org_name: formData.org_name,
        contact_name: formData.contact_name,
        role_title: formData.role_title || "",
        email: formData.email,
        website: formData.website || "",
        location: formData.location || "",
        org_type: formData.org_type || "",
        collab_type: formData.collab_type,
        success_definition: formData.success_definition || "",
        additional_notes: formData.additional_notes || "",
        consent_data_storage: formData.consent_data_storage,
      },
      details: {
        event: formData.collab_type.includes("Event Partner") ? {
          event_name: formData.event_name,
          event_date: formData.event_date,
          event_format: formData.event_format,
          expected_attendance: formData.expected_attendance,
          target_audience: formData.target_audience,
          event_description: formData.event_description,
        } : null,
        project: formData.collab_type.includes("Project Partner") ? {
          project_name: formData.project_name,
          project_summary: formData.project_summary,
          timeline: formData.timeline,
          project_goals: formData.project_goals,
        } : null,
        speaker: formData.collab_type.includes("Speaker Partner") ? {
          speaker_direction: formData.speaker_direction,
          speaker_name: formData.speaker_name,
          speaker_topic: formData.speaker_topic,
          speaker_profile_link: formData.speaker_profile_link,
          requested_topic: formData.requested_topic,
          number_of_speakers: formData.number_of_speakers,
        } : null,
        media: formData.collab_type.includes("Media Partner") ? {
          media_type: formData.media_type,
          platforms: formData.platforms,
          deliverables: formData.deliverables,
          posting_timeline: formData.posting_timeline,
          audience_reach: formData.audience_reach,
          past_work_link: formData.past_work_link,
        } : null,
        sponsor: formData.collab_type.includes("Sponsor") ? {
          sponsorship_type: formData.sponsorship_type,
          estimated_budget: formData.estimated_budget,
          what_they_provide: formData.what_they_provide,
          what_they_expect: formData.what_they_expect,
          brand_exposure: formData.brand_exposure,
        } : null,
        other: formData.collab_type.includes("Other") ? {
          collab_description: formData.collab_description,
          expectations: formData.expectations,
          notes: formData.notes,
        } : null,
      },
      honeypot: formData.honeypot,
      source: "lovable_form",
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
    };

    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwz6rQB_B0rwXLaJfDJyHYIbsA4xV6fSkebt2zMIiU7rm6NH4K6KPkXwBvRIopnBYbY/exec",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
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
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const renderStepContent = () => {
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
          showEventDetails={formData.collab_type.includes("Event Partner")}
          showProjectDetails={formData.collab_type.includes("Project Partner")}
        />
      );
    }
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
        <motion.button
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200 mb-6"
          onClick={onBack}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to roles</span>
        </motion.button>

        <FormProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={
            needsDetailsStep
              ? [{ label: "Organization" }, { label: "Type" }, { label: "Details" }, { label: "Final" }]
              : [{ label: "Organization" }, { label: "Type" }, { label: "Final" }]
          }
          completedMicrocopy={COLLAB_MICROCOPY}
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
            {renderStepContent()}
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
                  Submit Request
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
