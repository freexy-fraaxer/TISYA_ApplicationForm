import { useRef } from "react";
import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, Zap, Calendar, Compass, Hammer, HeartHandshake, Megaphone } from "lucide-react";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";

interface Step4Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const commitmentDurations = [
  { id: "1 month", label: "1 month", description: "Try it out", icon: Clock },
  { id: "3 months", label: "3 months", description: "Short-term project", icon: Zap },
  { id: "6+ months", label: "6+ months", description: "Long-term commitment", icon: Calendar },
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

const hoursLabels = ["1-2", "3-4", "5-7", "8-10", "10+"];

const Step4Schedule = ({ formData, updateFormData }: Step4Props) => {
  const { playSliderTick, playTick } = useSound();
  const lastHoursTick = useRef(formData.hours_per_week);

  const toggleWorkingStyle = (style: string) => {
    playTick();
    const current = formData.working_style;
    if (current.includes(style)) {
      updateFormData({ working_style: current.filter((s) => s !== style) });
    } else {
      updateFormData({ working_style: [...current, style] });
    }
  };

  const handleHoursChange = (value: number) => {
    if (value !== lastHoursTick.current) {
      playSliderTick();
      lastHoursTick.current = value;
    }
    updateFormData({ hours_per_week: value });
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

      <p className="text-xs text-center text-primary/60 italic -mt-4">
        Be realistic — this helps us assign you properly
      </p>

      {/* Commitment Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Commitment Duration <span className="text-destructive">*</span>
        </Label>
        <HelperText>How long can you commit for?</HelperText>
        <div className="grid grid-cols-3 gap-3">
          {commitmentDurations.map((level) => {
            const Icon = level.icon;
            const isSelected = formData.commitment_duration === level.id;
            return (
              <motion.button
                key={level.id}
                type="button"
                onClick={() => updateFormData({ commitment_duration: level.id })}
                className={cn("zone-card text-left p-3", isSelected && "selected")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col gap-1">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
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
            const isSelected = formData.impact_preference === style.id;
            return (
              <motion.button
                key={style.id}
                type="button"
                onClick={() => updateFormData({ impact_preference: style.id })}
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
          onValueChange={([value]) => handleHoursChange(value)}
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

      {/* Previous Volunteering */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Have you volunteered before? <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => updateFormData({ 
              previous_volunteering: true 
            })}
            className={cn(
              "chip px-6",
              formData.previous_volunteering === true && "selected"
            )}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => updateFormData({ 
              previous_volunteering: false,
              previous_volunteering_experience: ""
            })}
            className={cn(
              "chip px-6",
              formData.previous_volunteering === false && "selected"
            )}
          >
            No
          </button>
        </div>
        
        {formData.previous_volunteering === true && (
          <div className="mt-3 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Tell us about your experience
            </Label>
            <Textarea
              placeholder="What did you do? What was your role?"
              value={formData.previous_volunteering_experience}
              onChange={(e) => {
                if (e.target.value.length <= 500) {
                  updateFormData({ previous_volunteering_experience: e.target.value });
                }
              }}
              className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
            />
            <div className="text-xs text-muted-foreground text-right">
              {formData.previous_volunteering_experience?.length || 0}/500
            </div>
          </div>
        )}
      </div>

      {/* Project Experience */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Tell us about something you worked on
        </Label>
        <HelperText>Optional but recommended — keep it short.</HelperText>
        <Textarea
          placeholder="What was the project? What did you personally do?"
          value={formData.project_experience}
          onChange={(e) => {
            if (e.target.value.length <= 600) {
              updateFormData({ project_experience: e.target.value });
            }
          }}
          className="bg-secondary/50 border-border focus:border-primary min-h-[90px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.project_experience.length}/600
        </div>
      </div>

      {/* Portfolio / Links */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Portfolio / Links</Label>
        <HelperText>Optional — share anything that shows your work.</HelperText>
        <Textarea
          placeholder="Drive, Notion, GitHub, Instagram, etc."
          value={formData.portfolio_links}
          onChange={(e) => {
            if (e.target.value.length <= 400) {
              updateFormData({ portfolio_links: e.target.value });
            }
          }}
          className="bg-secondary/50 border-border focus:border-primary min-h-[60px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.portfolio_links.length}/400
        </div>
      </div>

      {/* Additional Info */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Anything else you want us to know?
        </Label>
        <HelperText>2–3 lines is more than enough.</HelperText>
        <Textarea
          placeholder="Fun fact, hidden talent, or anything you want us to know"
          value={formData.additional_info}
          onChange={(e) => {
            if (e.target.value.length <= 300) {
              updateFormData({ additional_info: e.target.value });
            }
          }}
          className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
        />
        <div className="text-xs text-muted-foreground text-right">
          {formData.additional_info.length}/300
        </div>
      </div>
    </div>
  );
};

export default Step4Schedule;
