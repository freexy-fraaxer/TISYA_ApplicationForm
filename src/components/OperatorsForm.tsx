import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import FormProgressBar from "./shared/FormProgressBar";
import Step1Basics from "./form-steps/Step1Basics";
import Step2ImpactZones from "./form-steps/Step2ImpactZones";
import Step2bLanguages from "./form-steps/Step2bLanguages";
import Step3Skills from "./form-steps/Step3Skills";
import Step4Schedule from "./form-steps/Step4Schedule";
import Step4bFunTags from "./form-steps/Step4bFunTags";
import Step5Review from "./form-steps/Step5Review";
import VolunteerSuccessScreen from "./shared/VolunteerSuccessScreen";
import { validateEmail, validatePhone } from "@/lib/validation";

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbySufLUPOzBY8moPnk461D2C12R5A89fHKSOAMW9QhmaLInsaabTb1da-pqdt7VSqiX/exec";

const OPERATOR_STEPS = [
  { label: "Basics" },
  { label: "Impact Zones" },
  { label: "Languages" },
  { label: "Skills" },
  { label: "Schedule" },
  { label: "Fun Tags" },
  { label: "Review" },
];

const OPERATOR_MICROCOPY = [
  "Looking good",
  "Nice picks",
  "Great languages",
  "Solid skills",
  "Almost done",
  "Fun side",
  "Final stretch",
];

export interface FormData {
  // Step 1
  full_name: string;
  email: string;
  contact_number: string;
  city: string;
  nationality: string;
  university: string;
  department: string;
  education_level: string;
  gender: string;
  how_found_us: string[];
  
  // Step 2 - Impact Zones with sub-options
  impact_zones: string[];
  zone_sub_options: Record<string, string[]>;
  zone_other_skills: Record<string, string>;
  
  // Legacy fields for backwards compatibility (kept but not actively used)
  tech_tools: string[];
  other_tech_skill: string;
  media_interests: string[];
  other_media_skill: string;
  
  // Step 2b - Languages
  languages_known: string[];
  other_language: string;
  primary_language: string;
  
  // Step 3
  skills: string[];
  slider_introvert_extrovert: number;
  slider_planner_spontaneous: number;
  slider_behind_front: number;
  
  // Step 4
  preferred_impact: string;
  involvement_level: string;
  hours_per_week: number;
  working_style: string[];
  volunteered_before: boolean | null;
  experience_brief: string;
  extra_notes: string;
  
  // Step 4b - Fun Tags
  fun_tags: string[];
  
  // Step 5
  consent_data_storage: boolean;
  consent_updates: boolean;
  
  // Hidden
  honeypot: string;
}

const initialFormData: FormData = {
  full_name: "",
  email: "",
  contact_number: "",
  city: "",
  nationality: "",
  university: "",
  department: "",
  education_level: "",
  gender: "",
  how_found_us: [],
  impact_zones: [],
  zone_sub_options: {},
  zone_other_skills: {},
  tech_tools: [],
  other_tech_skill: "",
  media_interests: [],
  other_media_skill: "",
  languages_known: [],
  other_language: "",
  primary_language: "",
  skills: [],
  slider_introvert_extrovert: 50,
  slider_planner_spontaneous: 50,
  slider_behind_front: 50,
  preferred_impact: "",
  involvement_level: "",
  hours_per_week: 3,
  working_style: [],
  volunteered_before: null,
  experience_brief: "",
  extra_notes: "",
  fun_tags: [],
  consent_data_storage: false,
  consent_updates: false,
  honeypot: "",
};

interface OperatorsFormProps {
  onBack: () => void;
}

const OperatorsForm = ({ onBack }: OperatorsFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const totalSteps = 7;

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear error when user makes changes
    if (submitError) setSubmitError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const emailValid = validateEmail(formData.email);
        const phoneValid = !formData.contact_number || validatePhone(formData.contact_number);
        return !!(
          formData.full_name.trim() &&
          formData.email.trim() &&
          emailValid &&
          phoneValid &&
          formData.city.trim() &&
          formData.nationality.trim() &&
          formData.university.trim() &&
          formData.education_level
        );
      case 2:
        return formData.impact_zones.length > 0;
      case 3:
        return !!formData.primary_language;
      case 4:
        return formData.skills.length > 0;
      case 5:
        return !!(
          formData.preferred_impact &&
          formData.involvement_level &&
          formData.hours_per_week &&
          formData.volunteered_before !== null &&
          (formData.volunteered_before === false || formData.experience_brief.trim())
        );
      case 6:
        return true; // Fun tags are optional
      case 7:
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
    // Prevent duplicate submissions
    if (!canProceed || formData.honeypot || isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Flatten zone_sub_options for submission
    const flattenedSubOptions: Record<string, string[]> = {};
    Object.entries(formData.zone_sub_options).forEach(([zone, options]) => {
      if (options.length > 0) {
        flattenedSubOptions[zone] = options;
      }
    });

    // Flatten zone_other_skills for submission
    const flattenedOtherSkills: Record<string, string> = {};
    Object.entries(formData.zone_other_skills).forEach(([zone, skill]) => {
      if (skill.trim()) {
        flattenedOtherSkills[zone] = skill;
      }
    });

    const payload = {
      formType: "volunteer",
      data: {
        full_name: formData.full_name,
        email: formData.email,
        contact_number: formData.contact_number || null,
        city: formData.city,
        nationality: formData.nationality,
        university: formData.university,
        department: formData.department || null,
        education_level: formData.education_level,
        gender: formData.gender || null,
        how_found_us: formData.how_found_us,
        impact_zones: formData.impact_zones,
        zone_sub_options: Object.keys(flattenedSubOptions).length > 0 ? flattenedSubOptions : null,
        zone_other_skills: Object.keys(flattenedOtherSkills).length > 0 ? flattenedOtherSkills : null,
        languages_known: formData.languages_known,
        other_language: formData.other_language || null,
        primary_language: formData.primary_language,
        skills: formData.skills,
        slider_introvert_extrovert: formData.slider_introvert_extrovert,
        slider_planner_spontaneous: formData.slider_planner_spontaneous,
        slider_behind_front: formData.slider_behind_front,
        preferred_impact: formData.preferred_impact,
        involvement_level: formData.involvement_level,
        hours_per_week: formData.hours_per_week,
        working_style: formData.working_style,
        volunteered_before: formData.volunteered_before ? "Yes" : "No",
        experience_brief: formData.experience_brief || null,
        extra_notes: formData.extra_notes || null,
        fun_tags: formData.fun_tags.length > 0 ? formData.fun_tags : null,
        consent_data_storage: formData.consent_data_storage,
        consent_updates: formData.consent_updates,
      },
      details: null, // Volunteers don't have conditional detail sections like collaborators
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      const result = await response.json();
      
      // Use the referenceId returned by the API
      setApplicationId(result.referenceId || null);
      setIsSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <VolunteerSuccessScreen applicationId={applicationId || ""} onBack={onBack} />;
  }

  const stepVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Basics formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <Step2ImpactZones formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <Step2bLanguages formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <Step3Skills formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <Step4Schedule formData={formData} updateFormData={updateFormData} />;
      case 6:
        return <Step4bFunTags formData={formData} updateFormData={updateFormData} />;
      case 7:
        return <Step5Review formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
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
          steps={OPERATOR_STEPS}
          completedMicrocopy={OPERATOR_MICROCOPY}
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
                  Submit Application
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

export default OperatorsForm;
