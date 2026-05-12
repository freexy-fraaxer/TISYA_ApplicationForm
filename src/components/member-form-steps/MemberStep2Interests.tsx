import { PathfinderFormData } from "../PathfinderForm";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Sparkles,
  Users,
  Calendar,
  Camera,
  Rocket,
  Wrench,
  Compass,
  Handshake,
  Search,
  Heart,
  Hammer,
  HelpCircle,
  Eye,
} from "lucide-react";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";
import { useT } from "@/contexts/LanguageContext";

interface Step2Props {
  formData: PathfinderFormData;
  updateFormData: (updates: Partial<PathfinderFormData>) => void;
}

const MemberStep2Interests = ({ formData, updateFormData }: Step2Props) => {
  const { playTick } = useSound();
  const t = useT();

  const attentionOptions = [
    { id: "I want to explore opportunities", label: t.pathfinderForm.step2.attentionOptions.explore, icon: Search },
    { id: "I want to meet people", label: t.pathfinderForm.step2.attentionOptions.meetPeople, icon: Heart },
    { id: "I want to build something", label: t.pathfinderForm.step2.attentionOptions.buildSomething, icon: Hammer },
    { id: "I'm just curious", label: t.pathfinderForm.step2.attentionOptions.justCurious, icon: HelpCircle },
  ];

  const interestOptions = [
    { id: "Community", label: t.pathfinderForm.step2.interests.community, icon: Users },
    { id: "Events", label: t.pathfinderForm.step2.interests.events, icon: Calendar },
    { id: "Skills", label: t.pathfinderForm.step2.interests.skills, icon: Wrench },
    { id: "Opportunities", label: t.pathfinderForm.step2.interests.opportunities, icon: Compass },
    { id: "Diplomacy", label: t.pathfinderForm.step2.interests.diplomacy, icon: Handshake },
    { id: "Media", label: t.pathfinderForm.step2.interests.media, icon: Camera },
    { id: "Projects", label: t.pathfinderForm.step2.interests.projects, icon: Rocket },
  ];

  const selectAttention = (id: string) => {
    playTick();
    updateFormData({ attention_reason: id });
  };

  const toggleInterest = (id: string) => {
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
          {t.pathfinderForm.step2.title}
        </h2>
        <p className="text-muted-foreground">
          {t.pathfinderForm.step2.subtitle}
        </p>
      </div>

      {/* What made you feel like TİSYA is for you - Single Select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-muted-foreground" />
          {t.pathfinderForm.step2.whatMadeYouFeel} <span className="text-destructive">*</span>
        </Label>
        <HelperText>{t.pathfinderForm.step2.pickOneFits}</HelperText>
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

      {/* What are you interested in - Multi Select */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          {t.pathfinderForm.step2.whatInterested} <span className="text-destructive">*</span>
        </Label>
        <HelperText>{t.pathfinderForm.step2.pickEnjoy}</HelperText>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interestOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = formData.interests.includes(option.id);
            return (
              <motion.button
                key={option.id}
                type="button"
                onClick={() => toggleInterest(option.id)}
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

      {/* Social Level Slider */}
      <div className="space-y-4">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          {t.pathfinderForm.step2.socialLevel}
        </Label>
        <HelperText>{t.pathfinderForm.step2.socialLevelHint}</HelperText>

        <div className="p-5 rounded-xl border-2 border-border/50 bg-secondary/30 space-y-4">
          <Slider
            min={1}
            max={5}
            step={1}
            value={[formData.social_level]}
            onValueChange={(value) => updateFormData({ social_level: value[0] })}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{t.pathfinderForm.step2.observeMore}</span>
            <span className="text-primary font-mono font-semibold text-sm">
              {formData.social_level}
            </span>
            <span>{t.pathfinderForm.step2.leadAndEngage}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberStep2Interests;
