import { useRef } from "react";
import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";

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

// Gen-Z dynamic labels for personality sliders
const getSocialEnergyLabel = (value: number): string => {
  if (value <= 20) return "Charging solo";
  if (value <= 40) return "Low-key observer";
  if (value <= 60) return "Social but selective";
  if (value <= 80) return "Main character energy";
  return "Runs the room";
};

const getPlanningStyleLabel = (value: number): string => {
  if (value <= 20) return "Needs a checklist";
  if (value <= 40) return "Plans... kinda";
  if (value <= 60) return "Vibes and adapts";
  if (value <= 80) return "Goes with the flow";
  return "Thrives in chaos";
};

const getVisibilityLabel = (value: number): string => {
  if (value <= 20) return "Silent operator";
  if (value <= 40) return "Support role vibes";
  if (value <= 60) return "Comfortable presenting";
  if (value <= 80) return "Stage-ready";
  return "On stage, mic on";
};

const Step3Skills = ({ formData, updateFormData }: Step3Props) => {
  const { playSliderTick, playTick } = useSound();
  const lastSocialTick = useRef(formData.social_energy);
  const lastPlanningTick = useRef(formData.planning_style);
  const lastVisibilityTick = useRef(formData.visibility_preference);

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
    "Structured tasks",
    "Creative freedom",
    "Fast-paced work",
    "Long-term projects",
  ];

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
          Skills & Strengths
        </h2>
        <p className="text-muted-foreground">
          Pick what you're actually comfortable doing
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center justify-between">
          <span>Your Skills <span className="text-destructive">*</span></span>
          <span className="text-xs text-muted-foreground font-normal">
            {formData.skills.length}/5
          </span>
        </Label>
        <HelperText>Pick up to 5 — quality over quantity.</HelperText>
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
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Personality Sliders with Gen-Z labels */}
      <div className="space-y-6 pt-4">
        <Label className="text-sm font-medium">Personality Traits</Label>

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
              Introvert
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.social_energy >= 50 ? 1 : 0.5,
                scale: formData.social_energy >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              Extrovert
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
              Planner
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.planning_style >= 50 ? 1 : 0.5,
                scale: formData.planning_style >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              Spontaneous
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
              Behind-the-scenes
            </motion.span>
            <motion.span
              className="text-muted-foreground transition-all"
              animate={{
                opacity: formData.visibility_preference >= 50 ? 1 : 0.5,
                scale: formData.visibility_preference >= 70 ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              Front-facing
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
    </div>
  );
};

export default Step3Skills;