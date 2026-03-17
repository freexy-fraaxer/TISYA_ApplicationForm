import { MemberFormData } from "../MemberForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Calendar,
  Camera,
  Rocket,
  GraduationCap,
  Search,
  Heart,
  Hammer,
  HelpCircle,
} from "lucide-react";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";

interface Step2Props {
  formData: MemberFormData;
  updateFormData: (updates: Partial<MemberFormData>) => void;
}

const attentionOptions = [
  { id: "explore_opportunities", label: "I want to explore opportunities", icon: Search },
  { id: "meet_people", label: "I want to meet people", icon: Heart },
  { id: "build_something", label: "I want to build something", icon: Hammer },
  { id: "just_curious", label: "I'm just curious", icon: HelpCircle },
];

const participationOptions = [
  { id: "Events", label: "Events", icon: Calendar },
  { id: "Media / Content", label: "Media / Content", icon: Camera },
  { id: "Projects / Startups", label: "Projects / Startups", icon: Rocket },
  { id: "Community", label: "Community", icon: Users },
  { id: "Learning / Skill-building", label: "Learning / Skill-building", icon: GraduationCap },
];

const MemberStep2Interests = ({ formData, updateFormData }: Step2Props) => {
  const { playTick } = useSound();

  const selectAttention = (id: string) => {
    playTick();
    updateFormData({ attention_reason: id });
  };

  const toggleParticipation = (id: string) => {
    playTick();
    const current = formData.interests;
    if (current.includes(id)) {
      updateFormData({ interests: current.filter((z) => z !== id) });
    } else {
      updateFormData({ interests: [...current, id] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Your Vibe
        </h2>
        <p className="text-muted-foreground">
          No wrong answers — just be honest
        </p>
      </div>

      {/* What caught your attention - Single Select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          What caught your attention about TİSYA? <span className="text-destructive">*</span>
        </Label>
        <HelperText>Pick the one that fits best.</HelperText>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attentionOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = formData.attention_reason === option.id;
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => selectAttention(option.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300 flex items-center gap-3 text-left",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                    isSelected ? "bg-primary/20" : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* What would you like to be part of - Multi Select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What would you like to be part of? <span className="text-destructive">*</span>
        </Label>
        <HelperText>Pick as many as you like.</HelperText>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {participationOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = formData.interests.includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => toggleParticipation(option.id)}
                className={cn(
                  "p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-2",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_20px_rgba(56,189,248,0.15)]"
                    : "border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50"
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary/20" : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium text-center",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MemberStep2Interests;
