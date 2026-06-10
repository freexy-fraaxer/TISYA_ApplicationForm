import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import { useT } from "@/contexts/LanguageContext";

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
import { submitToAppsScript } from "@/lib/submitForm";
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

const PioneerForm = ({ onBack }: { onBack: () => void }) => {
  const { playPulse, playBack } = useSound();
  const { triggerPulse } = useBackgroundEffects();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [appId, setAppId] = useState("");
  const t = useT();

  const handleBackToRoles = () => {
    playBack();
    onBack();
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        return !!(
          formData.full_name &&
          validateEmail(formData.email) &&
          validatePhone(formData.contact_number) &&
          validatePhone(formData.whatsapp_number) &&
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
    if (validateStep()) {
      playPulse();
      triggerPulse();
      setStep(prev => prev + 1);
    }
  };

  const prev = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep() || loading) return;

    setLoading(true);
    setError(null);

    try {
      // Keys MUST exactly match VOLUNTEER_FIELDS in the Apps Script
      const payload: Record<string, unknown> = {
        full_name: formData.full_name.trim(),
        email: formData.email.trim(),
        contact_number: formData.contact_number.trim(),
        whatsapp_number: formData.whatsapp_number.trim(),
        city: formData.city.trim(),
        nationality: formData.nationality.trim(),
        university: formData.university.trim(),
        department_of_study: formData.department_of_study.trim(),
        education_level: formData.education_level,
        gender: formData.gender,
        referral_source: formData.referral_source,
        primary_impact_zone: formData.primary_impact_zone,
        impact_zones: formData.impact_zones,
        open_to_other_roles: formData.open_to_other_roles,
        event_roles: formData.event_roles,
        media_design_skills: formData.media_design_skills,
        tech_skills: formData.tech_skills,
        outreach_skills: formData.outreach_skills,
        education_project_skills: formData.education_project_skills,
        research_policy_roles: formData.research_policy_roles,
        operations_roles: formData.operations_roles,
        languages_known: formData.languages_known,
        primary_language: formData.primary_language,
        language_proficiency: formData.language_proficiency,
        skills: formData.skills,
        social_energy: formData.social_energy,
        planning_style: formData.planning_style,
        visibility_preference: formData.visibility_preference,
        work_preference: formData.work_preference,
        commitment_duration: formData.commitment_duration,
        hours_per_week: formData.hours_per_week,
        previous_volunteering: formData.previous_volunteering,
        previous_volunteering_experience: formData.previous_volunteering_experience.trim(),
        portfolio_links: formData.portfolio_links.trim(),
        fun_tags: formData.fun_tags,
        consent_commitment: formData.consent_commitment,
        consent_data_storage: formData.consent_data_storage,
        consent_updates: formData.consent_updates,
      };

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
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard className="w-full max-w-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          {step > 1 ? (
            <motion.button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={prev}
              whileHover={{ x: -3 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.common.previous}</span>
            </motion.button>
          ) : <span />}
          <motion.button
            className="p-2 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150"
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close form"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <p className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-4 text-center">
          {t.common.missionProgress}
        </p>

        <FormProgressBar currentStep={step} totalSteps={7} steps={[
          { label: t.pioneerForm.steps.basics },
          { label: t.pioneerForm.steps.impact },
          { label: t.pioneerForm.steps.languages },
          { label: t.pioneerForm.steps.skills },
          { label: t.pioneerForm.steps.schedule },
          { label: t.pioneerForm.steps.fun },
          { label: t.pioneerForm.steps.review },
        ]} />

        <AnimatePresence mode="wait">
          <motion.div key={step}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {error && <div className="text-red-500 mt-4">{error}</div>}

        <div className="flex justify-end mt-8">
          {step < 7 ? (
            <HeroButton
              size="md"
              onClick={next}
              disabled={!validateStep()}
              className={!validateStep() ? "opacity-50 cursor-not-allowed" : ""}
            >
              {t.common.next}
              <ArrowRight className="w-4 h-4" />
            </HeroButton>
          ) : (
            <HeroButton
              size="md"
              onClick={handleSubmit}
              disabled={loading || !validateStep()}
              className={loading || !validateStep() ? "opacity-50 cursor-not-allowed" : ""}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t.common.submitting}
                </>
              ) : (
                <>
                  {t.common.submit}
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

export default PioneerForm;