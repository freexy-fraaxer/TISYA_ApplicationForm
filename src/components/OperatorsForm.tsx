import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";
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

const API_ENDPOINT = "https://script.google.com/macros/s/AKfycbzKCr4NnF6EqF0F6WCR-WbQrZl9JLzeVAZwAlJrwPTWxzpiXTaFkstzGE5krRdUfAGY/exec";

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
  whatsapp_number: string;
  city: string;
  nationality: string;
  university: string;
  department_of_study: string;
  education_level: string;
  current_status: string;
  gender: string;
  referral_source: string[];
  
  // Step 2 - Impact Zones with sub-options
  primary_impact_zone: string;
  impact_zones: string[];
  open_to_other_roles: string;
  event_roles: string[];
  media_design_skills: string[];
  tech_skills: string[];
  outreach_skills: string[];
  education_project_skills: string[];
  research_policy_roles: string[];
  operations_roles: string[];
  
  // Step 2b - Languages
  languages_known: string[];
  primary_language: string;
  language_proficiency: string;
  
  // Step 3 - Skills & Strengths
  skills: string[];
  social_energy: number;
  planning_style: number;
  visibility_preference: number;
  work_preference: string;
  
  // Step 4 - Schedule
  impact_preference: string;
  commitment_duration: string;
  hours_per_week: number;
  working_style: string[];
  previous_volunteering: boolean | null;
  previous_volunteering_experience: string;
  project_experience: string;
  portfolio_links: string;
  additional_info: string;
  
  // Step 4b - Fun Tags
  fun_tags: string[];
  
  // Step 5
  consent_commitment: boolean;
  consent_data_storage: boolean;
  consent_updates: boolean;
  
  // Hidden
  honeypot: string;
}

const initialFormData: FormData = {
  full_name: "",
  email: "",
  contact_number: "",
  whatsapp_number: "",
  city: "",
  nationality: "",
  university: "",
  department_of_study: "",
  education_level: "",
  current_status: "",
  gender: "",
  referral_source: [],
  primary_impact_zone: "",
  impact_zones: [],
  open_to_other_roles: "",
  event_roles: [],
  media_design_skills: [],
  tech_skills: [],
  outreach_skills: [],
  education_project_skills: [],
  research_policy_roles: [],
  operations_roles: [],
  languages_known: [],
  primary_language: "",
  language_proficiency: "",
  skills: [],
  social_energy: 50,
  planning_style: 50,
  visibility_preference: 50,
  work_preference: "",
  impact_preference: "",
  commitment_duration: "",
  hours_per_week: 3,
  working_style: [],
  previous_volunteering: null,
  previous_volunteering_experience: "",
  project_experience: "",
  portfolio_links: "",
  additional_info: "",
  fun_tags: [],
  consent_commitment: false,
  consent_data_storage: false,
  consent_updates: false,
  honeypot: "",
};

interface OperatorsFormProps {
  onBack: () => void;
}

const OperatorsForm = ({ onBack }: OperatorsFormProps) => {
  const { playPulse, playBack } = useSound();
  const { triggerPulse } = useBackgroundEffects();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleBackToRoles = () => {
    playBack();
    onBack();
  };

  const totalSteps = 7;

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    if (submitError) setSubmitError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        const emailValid = validateEmail(formData.email);
        const phoneValid = !formData.contact_number || validatePhone(formData.contact_number);
        const whatsappValid = !formData.whatsapp_number || validatePhone(formData.whatsapp_number);
        return !!(
          formData.full_name.trim() &&
          formData.email.trim() &&
          emailValid &&
          phoneValid &&
          whatsappValid &&
          formData.city.trim() &&
          formData.nationality.trim() &&
          formData.current_status &&
          formData.education_level
        );
      case 2:
        return !!formData.primary_impact_zone;
      case 3:
        return !!formData.primary_language;
      case 4:
        return formData.skills.length > 0 && formData.skills.length <= 5;
      case 5:
        return !!(
          formData.impact_preference &&
          formData.commitment_duration &&
          formData.hours_per_week &&
          formData.previous_volunteering !== null
        );
      case 6:
        return formData.fun_tags.length <= 5;
      case 7:
        return formData.consent_data_storage && formData.consent_commitment;
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

    const hoursLabelMap = ["1-2", "3-4", "5-7", "8-10", "10+"];
    const hoursIdx = Math.min(Math.floor((formData.hours_per_week - 1) / 2), hoursLabelMap.length - 1);
    const hoursLabel = hoursLabelMap[Math.max(0, hoursIdx)];

    const payload = {
      formType: "volunteer",
      data: {
        full_name: formData.full_name,
        email: formData.email,
        contact_number: formData.contact_number || null,
        whatsapp_number: formData.whatsapp_number || null,
        city: formData.city,
        nationality: formData.nationality,
        university: formData.university || null,
        department_of_study: formData.department_of_study || null,
        education_level: formData.education_level,
        current_status: formData.current_status,
        gender: formData.gender || null,
        referral_source: formData.referral_source.length > 0 ? formData.referral_source : null,
        primary_impact_zone: formData.primary_impact_zone,
        impact_zones: formData.impact_zones.length > 0 ? formData.impact_zones : null,
        open_to_other_roles: formData.open_to_other_roles || null,
        event_roles: formData.event_roles.length > 0 ? formData.event_roles : null,
        media_design_skills: formData.media_design_skills.length > 0 ? formData.media_design_skills : null,
        tech_skills: formData.tech_skills.length > 0 ? formData.tech_skills : null,
        outreach_skills: formData.outreach_skills.length > 0 ? formData.outreach_skills : null,
        education_project_skills: formData.education_project_skills.length > 0 ? formData.education_project_skills : null,
        research_policy_roles: formData.research_policy_roles.length > 0 ? formData.research_policy_roles : null,
        operations_roles: formData.operations_roles.length > 0 ? formData.operations_roles : null,
        languages_known: formData.languages_known.length > 0 ? formData.languages_known : null,
        primary_language: formData.primary_language,
        language_proficiency: formData.language_proficiency || null,
        skills: formData.skills,
        social_energy: formData.social_energy,
        planning_style: formData.planning_style,
        visibility_preference: formData.visibility_preference,
        work_preference: formData.work_preference || null,
        impact_preference: formData.impact_preference,
        commitment_duration: formData.commitment_duration,
        hours_per_week: formData.hours_per_week,
        hours_per_week_label: hoursLabel,
        working_style: formData.working_style.length > 0 ? formData.working_style : null,
        previous_volunteering: formData.previous_volunteering,
        previous_volunteering_experience: formData.previous_volunteering === true ? (formData.previous_volunteering_experience || null) : null,
        project_experience: formData.project_experience || null,
        portfolio_links: formData.portfolio_links || null,
        additional_info: formData.additional_info || null,
        fun_tags: formData.fun_tags.length > 0 ? formData.fun_tags : null,
        consent_commitment: formData.consent_commitment,
        consent_data_storage: formData.consent_data_storage,
        consent_updates: formData.consent_updates,
      },
      details: null,
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || "Submission failed");
      }

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
          steps={OPERATOR_STEPS}
          completedMicrocopy={OPERATOR_MICROCOPY}
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

export default OperatorsForm;
