import { MemberFormData } from "../MemberForm";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Users,
  Calendar,
  Lightbulb,
  Rocket,
  Globe,
  Camera,
  FolderKanban,
} from "lucide-react";

interface Step2Props {
  formData: MemberFormData;
  updateFormData: (updates: Partial<MemberFormData>) => void;
}

const interestZones = [
  { id: "Community", label: "Community", icon: Users },
  { id: "Events", label: "Events", icon: Calendar },
  { id: "Skills", label: "Skills", icon: Lightbulb },
  { id: "Opportunities", label: "Opportunities", icon: Rocket },
  { id: "Diplomacy", label: "Diplomacy", icon: Globe },
  { id: "Media", label: "Media", icon: Camera },
  { id: "Projects", label: "Projects", icon: FolderKanban },
];

const motivationOptions = ["Learn", "Meet people", "Grow", "Explore"];

// Gen-Z dynamic vibe labels
const getVibeLabel = (value: number): string => {
  if (value <= 20) return "Charging solo";
  if (value <= 40) return "Low-key observer";
  if (value <= 60) return "Social but selective";
  if (value <= 80) return "Main character energy";
  return "Runs the room";
};

const MemberStep2Interests = ({ formData, updateFormData }: Step2Props) => {
  const toggleZone = (zone: string) => {
    const current = formData.interest_zones;
    if (current.includes(zone)) {
      updateFormData({ interest_zones: current.filter((z) => z !== zone) });
    } else {
      updateFormData({ interest_zones: [...current, zone] });
    }
  };

  const toggleMotivation = (option: string) => {
    const current = formData.motivation;
    if (current.includes(option)) {
      updateFormData({ motivation: current.filter((m) => m !== option) });
    } else {
      updateFormData({ motivation: [...current, option] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Find your space
        </h2>
        <p className="text-muted-foreground">
          What brings you here?
        </p>
      </div>

      {/* Interest Zones Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What are you interested in? <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interestZones.map((zone, index) => {
            const Icon = zone.icon;
            const isSelected = formData.interest_zones.includes(zone.id);
            return (
              <motion.button
                key={zone.id}
                type="button"
                onClick={() => toggleZone(zone.id)}
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
                    "text-sm font-medium",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {zone.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Community Vibe Slider with Gen-Z labels */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          How social are you in communities?
        </Label>
        <div className="space-y-3">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Quiet</span>
            <span>Social</span>
          </div>
          <Slider
            value={[formData.community_vibe]}
            onValueChange={(value) => updateFormData({ community_vibe: value[0] })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="text-center">
            <motion.span
              key={getVibeLabel(formData.community_vibe)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium text-primary"
            >
              {getVibeLabel(formData.community_vibe)}
            </motion.span>
          </div>
        </div>
      </div>

      {/* Motivation Chips */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What motivates you?</Label>
        <div className="flex flex-wrap gap-2">
          {motivationOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleMotivation(option)}
              className={cn(
                "chip",
                formData.motivation.includes(option) && "selected"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberStep2Interests;
