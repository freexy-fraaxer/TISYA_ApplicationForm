import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, Zap, Calendar, Compass, Hammer, Users, HeartHandshake, Megaphone } from "lucide-react";
import HelperText from "../shared/HelperText";

interface Step4Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const involvementLevels = [
  {
    id: "Flexible / occasional",
    label: "Flexible / occasional",
    description: "Drop in when I can",
    icon: Compass,
  },
  {
    id: "Project-based",
    label: "Project-based",
    description: "Focused on specific tasks",
    icon: Zap,
  },
  {
    id: "Consistent weekly",
    label: "Consistent weekly",
    description: "Regular commitment",
    icon: Calendar,
  },
  {
    id: "Exploring for now",
    label: "Exploring for now",
    description: "Just getting started",
    icon: Clock,
  },
];

const impactStyles = [
  { id: "Building things", label: "Building things", icon: Hammer },
  { id: "Organizing and coordinating", label: "Organizing and coordinating", icon: Calendar },
  { id: "Supporting behind the scenes", label: "Supporting behind the scenes", icon: HeartHandshake },
  { id: "Leading and facilitating", label: "Leading and facilitating", icon: Megaphone },
];

const workingStyles = [
  "Remote",
  "In-person",
  "Hybrid",
  "Weekends",
  "Weekdays",
  "Evenings",
];

const funTags = [
  "Hidden musician",
  "Photographer",
  "Gamer",
  "Amateur chef",
  "Plant parent",
  "Writer",
  "Speaker",
  "Editor",
];

const hoursLabels = ["1-2", "3-4", "5-7", "8-10", "10+"];

const Step4Schedule = ({ formData, updateFormData }: Step4Props) => {
  const toggleWorkingStyle = (style: string) => {
    const current = formData.working_style;
    if (current.includes(style)) {
      updateFormData({ working_style: current.filter((s) => s !== style) });
    } else {
      updateFormData({ working_style: [...current, style] });
    }
  };

  const toggleFunTag = (tag: string) => {
    const current = formData.fun_tags;
    if (current.includes(tag)) {
      updateFormData({ fun_tags: current.filter((t) => t !== tag) });
    } else {
      updateFormData({ fun_tags: [...current, tag] });
    }
  };

  const getHoursLabel = (value: number) => {
    const index = Math.min(Math.floor((value - 1) / 2), hoursLabels.length - 1);
    return hoursLabels[Math.max(0, index)];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your schedule & story
        </h2>
        <p className="text-muted-foreground">
          Help us match you to the right team
        </p>
      </div>

      {/* Involvement Level */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Involvement Level <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {involvementLevels.map((level) => {
            const Icon = level.icon;
            const isSelected = formData.involvement_level === level.id;
            return (
              <motion.button
                key={level.id}
                type="button"
                onClick={() => updateFormData({ involvement_level: level.id })}
                className={cn("zone-card text-left p-4", isSelected && "selected")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div>
                    <h3
                      className={cn(
                        "font-medium text-sm",
                        isSelected ? "text-primary" : "text-foreground"
                      )}
                    >
                      {level.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {level.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Preferred Impact Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          How do you prefer to make impact? <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {impactStyles.map((style) => {
            const Icon = style.icon;
            const isSelected = formData.preferred_impact === style.id;
            return (
              <motion.button
                key={style.id}
                type="button"
                onClick={() => updateFormData({ preferred_impact: style.id })}
                className={cn("zone-card text-left p-3", isSelected && "selected")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isSelected ? "text-primary" : "text-foreground"
                    )}
                  >
                    {style.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Hours per week */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Hours per week <span className="text-destructive">*</span>
        </Label>
        <HelperText>Life happens, just be honest.</HelperText>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          {hoursLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <Slider
          value={[formData.hours_per_week]}
          onValueChange={([value]) => updateFormData({ hours_per_week: value })}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="text-center">
          <span className="text-primary font-medium">
            {getHoursLabel(formData.hours_per_week)} hours/week
          </span>
        </div>
      </div>

      {/* Working Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Working Style</Label>
        <div className="flex flex-wrap gap-2">
          {workingStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => toggleWorkingStyle(style)}
              className={cn(
                "chip",
                formData.working_style.includes(style) && "selected"
              )}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      {/* Volunteered Before */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Have you volunteered before? <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ volunteered_before: true })}
            className={cn(
              "chip px-6",
              formData.volunteered_before === true && "selected"
            )}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() =>
              updateFormData({ volunteered_before: false, experience_brief: "" })
            }
            className={cn(
              "chip px-6",
              formData.volunteered_before === false && "selected"
            )}
          >
            No
          </button>
        </div>
      </div>

      {/* Experience Brief (conditional) */}
      {formData.volunteered_before === true && (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <Label className="text-sm font-medium">
            Brief Experience <span className="text-destructive">*</span>
          </Label>
          <Textarea
            placeholder="Example: NGO projects, event support, media team…"
            value={formData.experience_brief}
            onChange={(e) => updateFormData({ experience_brief: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </motion.div>
      )}

      {/* Extra Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Anything else you want us to know?
        </Label>
        <HelperText>2–3 lines is more than enough.</HelperText>
        <Textarea
          placeholder="Fun fact, hidden talent, or anything you want us to know"
          value={formData.extra_notes}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              updateFormData({ extra_notes: e.target.value });
            }
          }}
          className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.extra_notes.length}/300
        </div>
      </div>

      {/* Fun Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Any fun tags?</Label>
        <div className="flex flex-wrap gap-2">
          {funTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleFunTag(tag)}
              className={cn(
                "chip",
                formData.fun_tags.includes(tag) && "selected"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step4Schedule;
