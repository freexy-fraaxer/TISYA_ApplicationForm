import { FormData } from "../OperatorsForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Palette,
  Code,
  Users,
  BookOpen,
  Search,
  Settings,
} from "lucide-react";
import HelperText from "../shared/HelperText";

interface Step2Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const impactZones = [
  {
    id: "Events",
    label: "Events",
    description: "Plan & organize community gatherings",
    icon: Calendar,
    subOptions: [
      "Event planning",
      "Logistics & coordination",
      "Speaker management",
      "Partnerships",
      "On-ground support",
    ],
  },
  {
    id: "Media & Design",
    label: "Media & Design",
    description: "Create visuals, content & campaigns",
    icon: Palette,
    subOptions: [
      "Graphic design",
      "Video editing",
      "Photography",
      "Copywriting",
      "Branding",
    ],
  },
  {
    id: "Tech & Digital",
    label: "Tech & Digital",
    description: "Build tools, website, automation",
    icon: Code,
    subOptions: [
      "Framer",
      "Webflow",
      "No-code tools",
      "Automation",
      "Frontend / Backend",
      "Data tools",
    ],
  },
  {
    id: "Community & Outreach",
    label: "Community & Outreach",
    description: "Partnerships, recruitment, networking",
    icon: Users,
    subOptions: [
      "Recruitment",
      "Partnerships",
      "Community management",
      "Moderation",
      "Networking",
    ],
  },
  {
    id: "Education & Projects",
    label: "Education & Projects",
    description: "Workshops, mentoring, project teams",
    icon: BookOpen,
    subOptions: [
      "Workshops",
      "Mentorship",
      "Curriculum support",
      "Research assistance",
      "Project coordination",
    ],
  },
  {
    id: "Research & Policy",
    label: "Research & Policy",
    description: "Research, reports, diplomacy topics",
    icon: Search,
    subOptions: [
      "Writing & reports",
      "Policy research",
      "Data collection",
      "Analysis",
      "Documentation",
    ],
  },
  {
    id: "Operations & Support",
    label: "Operations & Support",
    description: "Logistics, coordination, internal support",
    icon: Settings,
    subOptions: [
      "Internal coordination",
      "Admin support",
      "Documentation",
      "Process improvement",
    ],
  },
];

const Step2ImpactZones = ({ formData, updateFormData }: Step2Props) => {
  const toggleZone = (zone: string) => {
    const current = formData.impact_zones;
    if (current.includes(zone)) {
      // When deselecting a zone, also clear its sub-options
      const zoneConfig = impactZones.find((z) => z.id === zone);
      if (zoneConfig) {
        const currentSubOptions = formData.zone_sub_options || {};
        const updatedSubOptions = { ...currentSubOptions };
        delete updatedSubOptions[zone];
        updateFormData({
          impact_zones: current.filter((z) => z !== zone),
          zone_sub_options: updatedSubOptions,
        });
      } else {
        updateFormData({ impact_zones: current.filter((z) => z !== zone) });
      }
    } else {
      updateFormData({ impact_zones: [...current, zone] });
    }
  };

  const toggleSubOption = (zoneId: string, option: string) => {
    const currentSubOptions = formData.zone_sub_options || {};
    const zoneSubOptions = currentSubOptions[zoneId] || [];
    
    let updatedZoneSubOptions: string[];
    if (zoneSubOptions.includes(option)) {
      updatedZoneSubOptions = zoneSubOptions.filter((o) => o !== option);
    } else {
      updatedZoneSubOptions = [...zoneSubOptions, option];
    }
    
    updateFormData({
      zone_sub_options: {
        ...currentSubOptions,
        [zoneId]: updatedZoneSubOptions,
      },
    });
  };

  const handleOtherSkillChange = (zoneId: string, value: string) => {
    const currentOtherSkills = formData.zone_other_skills || {};
    updateFormData({
      zone_other_skills: {
        ...currentOtherSkills,
        [zoneId]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose your Impact Zone
        </h2>
        <p className="text-muted-foreground">
          Select one or more areas where you'd like to contribute
        </p>
      </div>

      {/* Impact Zones Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Impact Zones <span className="text-destructive">*</span>
        </Label>
        <HelperText>Pick what you enjoy or want to grow into.</HelperText>
        <div className="space-y-3">
          {impactZones.map((zone, index) => {
            const Icon = zone.icon;
            const isSelected = formData.impact_zones.includes(zone.id);
            const currentSubOptions = (formData.zone_sub_options || {})[zone.id] || [];
            const currentOtherSkill = (formData.zone_other_skills || {})[zone.id] || "";

            return (
              <div key={zone.id} className="space-y-2">
                <motion.button
                  type="button"
                  onClick={() => toggleZone(zone.id)}
                  className={cn("zone-card text-left w-full", isSelected && "selected")}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
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
                    <div>
                      <h3
                        className={cn(
                          "font-semibold text-sm",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {zone.label}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {zone.description}
                      </p>
                    </div>
                  </div>
                </motion.button>

                {/* Inline Sub-options */}
                <AnimatePresence>
                  {isSelected && zone.subOptions.length > 0 && (
                    <motion.div
                      className="ml-4 pl-4 border-l-2 border-primary/30 space-y-3"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label className="text-xs font-medium text-muted-foreground">
                        What specifically interests you?
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {zone.subOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => toggleSubOption(zone.id, option)}
                            className={cn(
                              "chip text-xs",
                              currentSubOptions.includes(option) && "selected"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      <div className="pt-2">
                        <Input
                          type="text"
                          placeholder={`Other ${zone.label.toLowerCase()} skill...`}
                          value={currentOtherSkill}
                          onChange={(e) => handleOtherSkillChange(zone.id, e.target.value)}
                          className="bg-secondary/50 border-border focus:border-primary text-sm h-9"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step2ImpactZones;
