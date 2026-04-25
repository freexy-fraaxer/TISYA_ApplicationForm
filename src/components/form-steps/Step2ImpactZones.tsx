import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Star,
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
    skillsField: "event_roles" as keyof FormData,
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
    skillsField: "media_design_skills" as keyof FormData,
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
    skillsField: "tech_skills" as keyof FormData,
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
    skillsField: "outreach_skills" as keyof FormData,
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
    skillsField: "education_project_skills" as keyof FormData,
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
    skillsField: "research_policy_roles" as keyof FormData,
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
    skillsField: "operations_roles" as keyof FormData,
    subOptions: [
      "Internal coordination",
      "Admin support",
      "Documentation",
      "Process improvement",
    ],
  },
];

const Step2ImpactZones = ({ formData, updateFormData }: Step2Props) => {
  const setPrimaryZone = (zoneId: string) => {
    // Remove from "other" interests if present
    const updatedOthers = formData.impact_zones.filter((z) => z !== zoneId);
    updateFormData({
      primary_impact_zone: zoneId,
      impact_zones: updatedOthers,
    });
  };

  const toggleZone = (zone: string) => {
    // Block adding primary zone as a secondary interest
    if (zone === formData.primary_impact_zone) return;
    const current = formData.impact_zones;
    if (current.includes(zone)) {
      updateFormData({ impact_zones: current.filter((z) => z !== zone) });
    } else {
      updateFormData({ impact_zones: [...current, zone] });
    }
  };

  const toggleSubOption = (zoneId: string, option: string, skillsField: keyof FormData | null) => {
    if (!skillsField) return;
    
    const currentSkills = (formData[skillsField] as string[]) || [];
    let updatedSkills: string[];
    
    if (currentSkills.includes(option)) {
      updatedSkills = currentSkills.filter((o) => o !== option);
    } else {
      updatedSkills = [...currentSkills, option];
    }
    
    updateFormData({ [skillsField]: updatedSkills } as Partial<FormData>);
  };

  const getSkillsForZone = (skillsField: keyof FormData | null): string[] => {
    if (!skillsField) return [];
    return (formData[skillsField] as string[]) || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Choose your Impact Zone
        </h2>
        <p className="text-muted-foreground">
          Pick where you'd like to focus first — and what else interests you
        </p>
      </div>

      {/* Primary Impact Zone (single select) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" />
          Select your PRIMARY area <span className="text-destructive">*</span>
        </Label>
        <HelperText>This is where you want to focus most of your time.</HelperText>
        <Select
          value={formData.primary_impact_zone}
          onValueChange={setPrimaryZone}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select your primary impact zone" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {impactZones.map((zone) => (
              <SelectItem key={zone.id} value={zone.id}>
                {zone.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-xs text-center text-primary/60 italic">
        This helps us match you to the right team
      </p>

      {/* Other Impact Zones */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Other areas you're interested in
        </Label>
        <HelperText>Optional — pick any extras you'd like to support.</HelperText>
        <div className="space-y-3">
          {impactZones.map((zone, index) => {
            const isPrimary = formData.primary_impact_zone === zone.id;
            const isSelected = formData.impact_zones.includes(zone.id);
            const currentSkills = getSkillsForZone(zone.skillsField);
            const Icon = zone.icon;

            if (isPrimary) return null;

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
                            onClick={() => toggleSubOption(zone.id, option, zone.skillsField)}
                            className={cn(
                              "chip text-xs",
                              currentSkills.includes(option) && "selected"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Open to other roles */}
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium">
          Open to other roles if needed?
        </Label>
        <HelperText>Helps us shuffle you in if a team needs extra hands.</HelperText>
        <div className="flex gap-2">
          {["Yes", "Maybe", "No"].map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => updateFormData({ open_to_other_roles: opt })}
              className={cn(
                "chip px-6",
                formData.open_to_other_roles === opt && "selected"
              )}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step2ImpactZones;