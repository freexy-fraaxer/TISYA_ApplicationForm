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

import { validateEmail } from "@/lib/validation";
import { submitToAppsScript } from "@/lib/submitForm";

/* =========================
   STEPS
========================= */

const STEPS = [
  { label: "Basics" },
  { label: "Impact" },
  { label: "Languages" },
  { label: "Skills" },
  { label: "Schedule" },
  { label: "Fun" },
  { label: "Review" },
];

/* =========================
   FORM DATA
========================= */

export interface FormData {
  full_name: string;
  email: string;
  contact_number: string;
  whatsapp_number: string;
  city: string;
  nationality: string;
  university: string;
  department_of_study: string;
  education_level: string;
  gender: string;
  referral_source: string[];

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

  languages_known: string[];
  primary_language: string;
  language_proficiency: string;

  skills: string[];
  social_energy: number;
  planning_style: number;
  visibility_preference: number;
  work_preference: string;

  commitment_duration: string;
  hours_per_week: number;

  previous_volunteering: boolean | null;
  previous_volunteering_experience: string;

  portfolio_links: string;

  fun_tags: string[];

  consent_commitment: boolean;
  consent_data_storage: boolean;
  consent_updates: boolean;

  honeypot: string;
}

/* =========================
   INITIAL STATE
========================= */

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

  commitment_duration: "",
  hours_per_week: 3,

  previous_volunteering: null,
  previous_volunteering_experience: "",

  portfolio_links: "",

  fun_tags: [],

  consent_commitment: false,
  consent_data_storage: false,
  consent_updates: false,

  honeypot: "",
};

/* =========================
   COMPONENT
========================= */

const OperatorsForm = ({ onBack }: { onBack: () => void }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState("");

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return (
          formData.full_name &&
          validateEmail(formData.email) &&
          formData.city &&
          formData.nationality &&
          formData.university &&
          formData.education_level
        );
      case 2:
        return formData.primary_impact_zone;
      case 3:
        return formData.primary_language;
      case 4:
        return formData.skills.length > 0;
      case 5:
        return (
          formData.commitment_duration &&
          formData.hours_per_week &&
          formData.previous_volunteering !== null
        );
      case 7:
        return (
          formData.consent_commitment &&
          formData.consent_data_storage
        );
      default:
        return true;
    }
  };

  const next = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const prev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = { ...formData };

      const res = await submitToAppsScript("Volunteer", payload);

      // ✅ CORRECT HANDLING (matches your submitForm.ts)
      setAppId(res.generatedId || "");
      setSuccess(true);

    } catch (err: any) {
      setError(err.message || "Submission failed");
    }

    setLoading(false);
  };

  if (success) {
    return <VolunteerSuccessScreen applicationId={appId} onBack={onBack} />;
  }

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1Basics formData={formData} updateFormData={updateFormData} />;
      case 2: return <Step2ImpactZones formData={formData} updateFormData={updateFormData} />;
      case 3: return <Step2bLanguages formData={formData} updateFormData={updateFormData} />;
      case 4: return <Step3Skills formData={formData} updateFormData={updateFormData} />;
      case 5: return <Step4Schedule formData={formData} updateFormData={updateFormData} />;
      case 6: return <Step4bFunTags formData={formData} updateFormData={updateFormData} />;
      case 7: return <Step5Review formData={formData} updateFormData={updateFormData} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="w-full max-w-2xl p-6">

        <FormProgressBar currentStep={step} totalSteps={7} steps={STEPS} />

        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <HeroButton onClick={prev}>
              <ArrowLeft /> Back
            </HeroButton>
          )}

          {step < 7 ? (
            <HeroButton onClick={next} disabled={!validateStep()}>
              Next <ArrowRight />
            </HeroButton>
          ) : (
            <HeroButton onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <>Submit <Check /></>}
            </HeroButton>
          )}
        </div>

      </GlassCard>
    </div>
  );
};

export default OperatorsForm;