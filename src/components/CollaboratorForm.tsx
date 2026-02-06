import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import CollabStep1OrgInfo from "./collaborator-form-steps/CollabStep1OrgInfo";
import CollabStep2Type from "./collaborator-form-steps/CollabStep2Type";
import CollabStepEventDetails from "./collaborator-form-steps/CollabStepEventDetails";
import CollabStepProjectDetails from "./collaborator-form-steps/CollabStepProjectDetails";
import CollabStepSpeakerDetails from "./collaborator-form-steps/CollabStepSpeakerDetails";
import CollabStepMediaDetails from "./collaborator-form-steps/CollabStepMediaDetails";
import CollabStepSponsorDetails from "./collaborator-form-steps/CollabStepSponsorDetails";
import CollabStepCommunityDetails from "./collaborator-form-steps/CollabStepCommunityDetails";
import CollabStepOtherDetails from "./collaborator-form-steps/CollabStepOtherDetails";
import CollabStep4Final from "./collaborator-form-steps/CollabStep4Final";
import CollaboratorSuccessScreen from "./shared/CollaboratorSuccessScreen";
import { validateEmail, validateUrl } from "@/lib/validation";

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbzKCr4NnF6EqF0F6WCR-WbQrZl9JLzeVAZwAlJrwPTWxzpiXTaFkstzGE5krRdUfAGY/exec";

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
  event_support_expected: string;
  
  // Project Partner
  project_name: string;
  project_summary: string;
  timeline: string;
  project_goals: string;
  collaboration_scope: string;
  
  // Speaker Partner
  speaker_direction: string;
  speaker_name: string;
  speaker_topic: string;
  speaker_bio: string;
  speaker_profile_link: string;
  requested_topic: string;
  number_of_speakers: string;
  audience_type: string;
  session_format: string;
  
  // Media Partner
  media_type: string[];
  platforms: string[];
  deliverables: string;
  posting_timeline: string;
  audience_reach: string;
  past_work_link: string;
  media_success: string;
  
  // Sponsor
  sponsorship_type: string[];
  estimated_budget: string;
  what_they_provide: string;
  what_they_expect: string;
  brand_exposure: string;
  
  // Community Partner
  community_collab_type: string;
  community_size: string;
  community_target_audience: string;
  planned_activities: string;
  community_success: string;
  
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
  event_support_expected: "",
  project_name: "",
  project_summary: "",
  timeline: "",
  project_goals: "",
  collaboration_scope: "",
  speaker_direction: "",
  speaker_name: "",
  speaker_topic: "",
  speaker_bio: "",
  speaker_profile_link: "",
  requested_topic: "",
  number_of_speakers: "",
  audience_type: "",
  session_format: "",
  media_type: [],
  platforms: [],
  deliverables: "",
  posting_timeline: "",
  audience_reach: "",
  past_work_link: "",
  media_success: "",
  sponsorship_type: [],
  estimated_budget: "",
  what_they_provide: "",
  what_they_expect: "",
  brand_exposure: "",
  community_collab_type: "",
  community_size: "",
  community_target_audience: "",
  planned_activities: "",
  community_success: "",
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

// Define collaboration type to page mapping
const COLLAB_TYPE_PAGES = [
  "Event Partner",
  "Project Partner",
  "Speaker Partner",
  "Media Partner",
  "Sponsor",
  "Community Partner",
  "Other",
] as const;

interface CollaboratorFormProps {
  onBack: () => void;
}

const CollaboratorForm = ({ onBack }: CollaboratorFormProps) => {
  const { playPulse, playBack } = useSound();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CollaboratorFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBackToRoles = () => {
    playBack();
    onBack();
  };

  // Dynamically calculate steps based on selected collaboration types
  const dynamicSteps = useMemo(() => {
    const steps: { label: string; type: string }[] = [
      { label: "Organization", type: "org" },
      { label: "Type", type: "type" },
    ];

    // Add detail pages for each selected collaboration type
    COLLAB_TYPE_PAGES.forEach((type) => {
      if (formData.collab_type.includes(type)) {
        const shortLabel = type.replace(" Partner", "").replace(" ", "");
        steps.push({ label: shortLabel, type });
      }
    });

    // Always end with Final/Review
    steps.push({ label: "Review", type: "final" });

    return steps;
  }, [formData.collab_type]);

  const totalSteps = dynamicSteps.length;

  const updateFormData = (updates: Partial<CollaboratorFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear error when user makes changes
    if (submitError) setSubmitError(null);
  };

  const validateStep = (step: number): boolean => {
    const currentStepType = dynamicSteps[step - 1]?.type;

    switch (currentStepType) {
      case "org":
        const emailValid = validateEmail(formData.email);
        const websiteValid = !formData.website || validateUrl(formData.website);
        return !!(
          formData.org_name.trim() &&
          formData.contact_name.trim() &&
          formData.email.trim() &&
          emailValid &&
          websiteValid
        );
      case "type":
        return formData.collab_type.length > 0;
      case "Speaker Partner":
        return !!formData.speaker_direction;
      case "final":
        return formData.consent_data_storage;
      default:
        return true; // Detail pages are optional
    }
  };

  const canProceed = validateStep(currentStep);

  const handleNext = () => {
    if (currentStep < totalSteps && canProceed) {
      playPulse();
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

    const payload = {
      formType: "collaborator",
      data: {
        organization_name: formData.org_name,
        contact_name: formData.contact_name,
        role_title: formData.role_title || null,
        email: formData.email,
        website: formData.website || null,
        location: formData.location || null,
        organization_type: formData.org_type || null,
        collaboration_type: formData.collab_type.length > 0 ? formData.collab_type : [],
        preferred_timeline: formData.preferred_timeline || null,
        budget_range: formData.budget_range || null,
        success_metric: formData.success_definition || null,
        additional_notes: formData.additional_notes || null,
        consent_data_storage: formData.consent_data_storage,
      },
      details: {
        event: formData.collab_type.includes("Event Partner") ? {
          event_name: formData.event_name || null,
          event_date: formData.event_date || null,
          event_format: formData.event_format || null,
          expected_attendance: formData.expected_attendance || null,
          target_audience: formData.target_audience || null,
          event_description: formData.event_description || null,
          event_support_expected: formData.event_support_expected || null,
        } : null,
        project: formData.collab_type.includes("Project Partner") ? {
          project_name: formData.project_name || null,
          project_summary: formData.project_summary || null,
          timeline: formData.timeline || null,
          project_goals: formData.project_goals || null,
          collaboration_scope: formData.collaboration_scope || null,
        } : null,
        speaker: formData.collab_type.includes("Speaker Partner") ? {
          speaker_direction: formData.speaker_direction || null,
          speaker_name: formData.speaker_name || null,
          speaker_topic: formData.speaker_topic || null,
          speaker_bio: formData.speaker_bio || null,
          speaker_profile_link: formData.speaker_profile_link || null,
          requested_topic: formData.requested_topic || null,
          number_of_speakers: formData.number_of_speakers || null,
          audience_type: formData.audience_type || null,
          session_format: formData.session_format || null,
        } : null,
        media: formData.collab_type.includes("Media Partner") ? {
          media_type: formData.media_type.length > 0 ? formData.media_type : null,
          platforms: formData.platforms.length > 0 ? formData.platforms : null,
          deliverables: formData.deliverables || null,
          posting_timeline: formData.posting_timeline || null,
          audience_reach: formData.audience_reach || null,
          past_work_link: formData.past_work_link || null,
          media_success: formData.media_success || null,
        } : null,
        sponsorship: formData.collab_type.includes("Sponsor") ? {
          sponsorship_type: formData.sponsorship_type.length > 0 ? formData.sponsorship_type : null,
          estimated_budget: formData.estimated_budget || null,
          what_they_provide: formData.what_they_provide || null,
          what_they_expect: formData.what_they_expect || null,
          brand_exposure: formData.brand_exposure || null,
        } : null,
        community: formData.collab_type.includes("Community Partner") ? {
          community_collab_type: formData.community_collab_type || null,
          community_size: formData.community_size || null,
          community_target_audience: formData.community_target_audience || null,
          planned_activities: formData.planned_activities || null,
          community_success: formData.community_success || null,
        } : null,
        other: formData.collab_type.includes("Other") ? {
          collab_description: formData.collab_description || null,
          expectations: formData.expectations || null,
          notes: formData.notes || null,
        } : null,
      },
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Handle success: false from backend
      if (!result.success) {
        throw new Error(result.error || result.message || "Submission failed");
      }

      // Use the referenceId returned by the API
      setApplicationId(result.referenceId || null);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <CollaboratorSuccessScreen
        applicationId={applicationId || ""}
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
    const currentStepType = dynamicSteps[currentStep - 1]?.type;

    switch (currentStepType) {
      case "org":
        return <CollabStep1OrgInfo formData={formData} updateFormData={updateFormData} />;
      case "type":
        return <CollabStep2Type formData={formData} updateFormData={updateFormData} />;
      case "Event Partner":
        return <CollabStepEventDetails formData={formData} updateFormData={updateFormData} />;
      case "Project Partner":
        return <CollabStepProjectDetails formData={formData} updateFormData={updateFormData} />;
      case "Speaker Partner":
        return <CollabStepSpeakerDetails formData={formData} updateFormData={updateFormData} />;
      case "Media Partner":
        return <CollabStepMediaDetails formData={formData} updateFormData={updateFormData} />;
      case "Sponsor":
        return <CollabStepSponsorDetails formData={formData} updateFormData={updateFormData} />;
      case "Community Partner":
        return <CollabStepCommunityDetails formData={formData} updateFormData={updateFormData} />;
      case "Other":
        return <CollabStepOtherDetails formData={formData} updateFormData={updateFormData} />;
      case "final":
        return <CollabStep4Final formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  // Generate progress bar labels
  const progressSteps = dynamicSteps.map((step) => ({ label: step.label }));
  const microcopy = dynamicSteps.map((_, i) => 
    i === 0 ? "Great start" : 
    i === dynamicSteps.length - 1 ? "Almost there" : 
    "Looking good"
  );

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
          onClick={handleBackToRoles}
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to roles</span>
        </motion.button>

        <FormProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={progressSteps}
          completedMicrocopy={microcopy}
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
