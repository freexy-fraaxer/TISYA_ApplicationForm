import { useRef } from "react";
import { FormData } from "../PioneerForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";
import { useT } from "@/contexts/LanguageContext";

interface Step3Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const skills = [
  "Teamwork",
  "Leadership",
  "Empathy",
  "Event Planning",
  "Social Media",
  "Design",
  "Video Editing",
  "Writing/Copywriting",
  "Public Speaking",
  "Research",
  "Outreach/Networking",
  "Coding/No-Code",
  "Project Management",
  "Translation/Language Support",
  "Willing to learn",
];

const Step3Skills = ({ formData, updateFormData }: Step3Props) => {
  const t = useT();
  const { playSliderTick, playTick } = useSound();
  const lastSocialTick = useRef(formData.social_energy);
  const lastPlanningTick = useRef(formData.planning_style);
  const lastVisibilityTick = useRef(formData.visibility_preference);

  const getSocialEnergyLabel = (value: number): string => {
    if (value <= 20) return t.pioneerForm.step3.socialEnergy.chargingSolo;
    if (value <= 40) return t.pioneerForm.step3.socialEnergy.lowKeyObserver;
    if (value <= 60) return t.pioneerForm.step3.socialEnergy.socialButSelective;
    if (value <= 80) return t.pioneerForm.step3.socialEnergy.mainCharacterEnergy;
    return t.pioneerForm.step3.socialEnergy.runsTheRoom;
  };

  const getPlanningStyleLabel = (value: number): string => {
    if (value <= 20) return t.pioneerForm.step3.planningStyle.needsChecklist;
    if (value <= 40) return t.pioneerForm.step3.planningStyle.plansKinda;
    if (value <= 60) return t.pioneerForm.step3.planningStyle.vibesAndAdapts;
    if (value <= 80) return t.pioneerForm.step3.planningStyle.goesWithFlow;
    return t.pioneerForm.step3.planningStyle.thrivesInChaos;
  };

  const getVisibilityLabel = (value: number): string => {
    if (value <= 20) return t.pioneerForm.step3.visibility.silentPioneer;
    if (value <= 40) return t.pioneerForm.step3.visibility.supportRoleVibes;
    if (value <= 60) return t.pioneerForm.step3.visibility.comfortablePresenting;
    if (value <= 80) return t.pioneerForm.step3.visibility.stageReady;
    return t.pioneerForm.step3.visibility.onStageMicOn;
  };

  const toggleSkill = (skill: string) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      playTick();
      updateFormData({ skills: current.filter((s) => s !== skill) });
    } else {
      // Cap at 5
      if (current.length >= 5) return;
      playTick();
      updateFormData({ skills: [...current, skill] });
    }
  };

  const workPreferences = [
    { value: "Structured tasks", label: t.pioneerForm.step3.workPreferences.structuredTasks },
    { value: "Creative freedom", label: t.pioneerForm.step3.workPreferences.creativeFreedom },
    { value: "Fast-paced work", label: t.pioneerForm.step3.workPreferences.fastPacedWork },
    { value: "Long-term projects", label: t.pioneerForm.step3.workPreferences.longTermProjects },
  ];

  const getSkillLabel = (skill: string) => {
    switch (skill) {
      case "Teamwork": return t.pioneerForm.step3.skills.teamwork;
      case "Leadership": return t.pioneerForm.step3.skills.leadership;
      case "Empathy": return t.pioneerForm.step3.skills.empathy;
      case "Event Planning": return t.pioneerForm.step3.skills.eventPlanning;
      case "Social Media": return t.pioneerForm.step3.skills.socialMedia;
      case "Design": return t.pioneerForm.step3.skills.design;
      case "Video Editing": return t.pioneerForm.step3.skills.videoEditing;
      case "Writing/Copywriting": return t.pioneerForm.step3.skills.writingCopywriting;
      case "Public Speaking": return t.pioneerForm.step3.skills.publicSpeaking;
      case "Research": return t.pioneerForm.step3.skills.research;
      case "Outreach/Networking": return t.pioneerForm.step3.skills.outreachNetworking;
      case "Coding/No-Code": return t.pioneerForm.step3.skills.codingNoCode;
      case "Project Management": return t.pioneerForm.step3.skills.projectManagement;
      case "Translation/Language Support": return t.pioneerForm.step3.skills.translationLanguage;
      case "Willing to learn": return t.pioneerForm.step3.skills.willingToLearn;
      default: return skill;
    }
  };

  const handleSliderChange = (
    field: keyof FormData,
    value: number,
    lastRef: React.MutableRefObject<number>
  ) => {
    if (Math.abs(value - lastRef.current) >= 10) {
      playSliderTick();
      lastRef.current = value;
    }
    updateFormData({ [field]: value } as Partial<FormData>);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.pioneerForm.step3.title}
        </h2>
        <p className="text-muted-foreground">
          {t.pioneerForm.step3.subtitle}
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center justify-between">
          <span>{t.pioneerForm.step3.yourSkills} <span className="text-destructive">*</span></span>
          <span className="text-xs text-muted-foreground font-normal">
            {formData.skills.length}/5
          </span>
        </Label>
        <HelperText>{t.pioneerForm.step3.skillsHint}</HelperText>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => {
            const isSelected = formData.skills.includes(skill);
            const atCap = formData.skills.length >= 5 && !isSelected;
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                disabled={atCap}
                className={cn(
                  "chip",
                  isSelected && "selected",
                  atCap && "opacity-40 cursor-not-allowed"
                )}
              >
                {getSkillLabel(skill)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personality Sliders with Gen-Z labels */}
      <div className="space-y-6 pt-4">
        <Label className="text-sm font-medium">{t.pioneerForm.step3.personalityTraits}</Label>

        {/* Social Energy (Introvert/Extrovert) */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.social_energy <= 50 ? 1 : 0.5,
                scale: formData.social_energy <= 30 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.introvert}
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.social_energy >= 50 ? 1 : 0.5,
                scale: formData.social_energy >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.extrovert}
            </motion.span>
          </div>
          <Slider
            value={[formData.social_energy]}
            onValueChange={([value]) =>
              handleSliderChange("social_energy", value, lastSocialTick)
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getSocialEnergyLabel(formData.social_energy)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getSocialEnergyLabel(formData.social_energy)}
            </motion.span>
          </div>
        </div>

        {/* Planning Style (Planner/Spontaneous) */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.planning_style <= 50 ? 1 : 0.5,
                scale: formData.planning_style <= 30 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.planner}
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.planning_style >= 50 ? 1 : 0.5,
                scale: formData.planning_style >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.spontaneous}
            </motion.span>
          </div>
          <Slider
            value={[formData.planning_style]}
            onValueChange={([value]) =>
              handleSliderChange("planning_style", value, lastPlanningTick)
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getPlanningStyleLabel(formData.planning_style)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getPlanningStyleLabel(formData.planning_style)}
            </motion.span>
          </div>
        </div>

        {/* Visibility Preference (Behind-the-scenes/Front-facing) */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.visibility_preference <= 50 ? 1 : 0.5,
                scale: formData.visibility_preference <= 30 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.behindTheScenes}
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.visibility_preference >= 50 ? 1 : 0.5,
                scale: formData.visibility_preference >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {t.pioneerForm.step3.frontFacing}
            </motion.span>
          </div>
          <Slider
            value={[formData.visibility_preference]}
            onValueChange={([value]) =>
              handleSliderChange("visibility_preference", value, lastVisibilityTick)
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getVisibilityLabel(formData.visibility_preference)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getVisibilityLabel(formData.visibility_preference)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Work Preference */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium">{t.pioneerForm.step3.workPreference}</Label>
        <HelperText>{t.pioneerForm.step3.workPreferenceHint}</HelperText>
        <div className="flex flex-wrap gap-2">
          {workPreferences.map((pref) => (
            <button
              key={pref.value}
              type="button"
              onClick={() => updateFormData({ work_preference: pref.value })}
              className={cn(
                "chip",
                formData.work_preference === pref.value && "selected"
              )}
            >
              {pref.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step3Skills;