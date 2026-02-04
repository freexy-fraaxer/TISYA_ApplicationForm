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
import HelperText from "../shared/HelperText";

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

const MemberStep2Interests = ({ formData, updateFormData }: Step2Props) => {
  const toggleZone = (zone: string) => {
    const current = formData.interests;
    if (current.includes(zone)) {
      updateFormData({ interests: current.filter((z) => z !== zone) });
    } else {
      updateFormData({ interests: [...current, zone] });
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
        <HelperText>Pick what you enjoy or want to grow into.</HelperText>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {interestZones.map((zone, index) => {
            const Icon = zone.icon;
            const isSelected = formData.interests.includes(zone.id);
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

      {/* Community Vibe Slider */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">
          How social are you in communities?
        </Label>
        <HelperText>Life happens, just be honest.</HelperText>
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Quiet</span>
            <span className="text-muted-foreground">Social</span>
          </div>
          <Slider
            value={[formData.community_vibe]}
            onValueChange={(value) => updateFormData({ community_vibe: value[0] })}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default MemberStep2Interests;
