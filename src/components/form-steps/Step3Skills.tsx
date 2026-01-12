import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

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
  const toggleSkill = (skill: string) => {
    const current = formData.skills;
    if (current.includes(skill)) {
      updateFormData({ skills: current.filter((s) => s !== skill) });
    } else {
      updateFormData({ skills: [...current, skill] });
    }
  };

  const getSliderLabel = (value: number, leftLabel: string, rightLabel: string) => {
    if (value < 35) return leftLabel;
    if (value > 65) return rightLabel;
    return "Balanced";
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

      {/* Personality Sliders */}
      <div className="space-y-6 pt-4">
        <Label className="text-sm font-medium">Personality Traits</Label>

        {/* Introvert/Extrovert */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Introvert</span>
            <span className="text-primary font-medium">
              {getSliderLabel(
                formData.slider_introvert_extrovert,
                "Introvert",
                "Extrovert"
              )}
            </span>
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
        </div>

        {/* Planner/Spontaneous */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Planner</span>
            <span className="text-primary font-medium">
              {getSliderLabel(
                formData.slider_planner_spontaneous,
                "Planner",
                "Spontaneous"
              )}
            </span>
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
        </div>

        {/* Behind-the-scenes/Front-facing */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Behind-the-scenes</span>
            <span className="text-primary font-medium">
              {getSliderLabel(
                formData.slider_behind_front,
                "Behind-the-scenes",
                "Front-facing"
              )}
            </span>
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
        </div>
      </div>
    </div>
  );
};

export default Step3Skills;
