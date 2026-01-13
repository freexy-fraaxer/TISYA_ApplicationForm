import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";

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
const getIntrovertExtrovertLabel = (value: number): string => {
  if (value <= 20) return "Charging solo";
  if (value <= 40) return "Low-key observer";
  if (value <= 60) return "Social but selective";
  if (value <= 80) return "Main character energy";
  return "Runs the room";
};

const getPlannerSpontaneousLabel = (value: number): string => {
  if (value <= 20) return "Needs a checklist";
  if (value <= 40) return "Plans... kinda";
  if (value <= 60) return "Vibes and adapts";
  if (value <= 80) return "Goes with the flow";
  return "Thrives in chaos";
};

const getBehindFrontLabel = (value: number): string => {
  if (value <= 20) return "Silent operator";
  if (value <= 40) return "Support role vibes";
  if (value <= 60) return "Comfortable presenting";
  if (value <= 80) return "Stage-ready";
  return "On stage, mic on";
};

const Step3Skills = ({ formData, updateFormData }: Step3Props) => {
  const toggleSkill = (skill: string) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      updateFormData({ skills: current.filter((s) => s !== skill) });
    } else {
      updateFormData({ skills: [...current, skill] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Skills & Personality
        </h2>
        <p className="text-muted-foreground">
          What superpowers do you bring to the team?
        </p>
      </div>

      {/* Skills */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Your Skills <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={cn(
                "chip",
                formData.skills.includes(skill) && "selected"
              )}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Personality Sliders with Gen-Z labels */}
      <div className="space-y-6 pt-4">
        <Label className="text-sm font-medium">Personality Traits</Label>

        {/* Introvert/Extrovert */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Introvert</span>
            <span className="text-muted-foreground">Extrovert</span>
          </div>
          <Slider
            value={[formData.slider_introvert_extrovert]}
            onValueChange={([value]) =>
              updateFormData({ slider_introvert_extrovert: value })
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getIntrovertExtrovertLabel(formData.slider_introvert_extrovert)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getIntrovertExtrovertLabel(formData.slider_introvert_extrovert)}
            </motion.span>
          </div>
        </div>

        {/* Planner/Spontaneous */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Planner</span>
            <span className="text-muted-foreground">Spontaneous</span>
          </div>
          <Slider
            value={[formData.slider_planner_spontaneous]}
            onValueChange={([value]) =>
              updateFormData({ slider_planner_spontaneous: value })
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getPlannerSpontaneousLabel(formData.slider_planner_spontaneous)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getPlannerSpontaneousLabel(formData.slider_planner_spontaneous)}
            </motion.span>
          </div>
        </div>

        {/* Behind-the-scenes/Front-facing */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Behind-the-scenes</span>
            <span className="text-muted-foreground">Front-facing</span>
          </div>
          <Slider
            value={[formData.slider_behind_front]}
            onValueChange={([value]) =>
              updateFormData({ slider_behind_front: value })
            }
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getBehindFrontLabel(formData.slider_behind_front)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getBehindFrontLabel(formData.slider_behind_front)}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3Skills;
