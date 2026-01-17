import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  },
  {
    id: "Media & Design",
    label: "Media & Design",
    description: "Create visuals, content & campaigns",
    icon: Palette,
  },
  {
    id: "Tech & Digital",
    label: "Tech & Digital",
    description: "Build tools, website, automation",
    icon: Code,
  },
  {
    id: "Community & Outreach",
    label: "Community & Outreach",
    description: "Partnerships, recruitment, networking",
    icon: Users,
  },
  {
    id: "Education & Projects",
    label: "Education & Projects",
    description: "Workshops, mentoring, project teams",
    icon: BookOpen,
  },
  {
    id: "Research & Policy",
    label: "Research & Policy",
    description: "Research, reports, diplomacy topics",
    icon: Search,
  },
  {
    id: "Operations & Support",
    label: "Operations & Support",
    description: "Logistics, coordination, internal support",
    icon: Settings,
  },
];

const motivationTags = [
  "Community",
  "Skills",
  "Impact",
  "Leadership",
  "Events",
  "Creativity",
  "Opportunities",
  "Just curious",
];

const techTools = [
  "Framer",
  "Webflow",
  "Notion",
  "Airtable",
  "Bubble",
  "JS",
  "Python",
  "Other",
];

const mediaInterests = [
  "Post design",
  "Video edits",
  "Photography",
  "Copywriting",
  "Branding",
];

const Step2ImpactZones = ({ formData, updateFormData }: Step2Props) => {
  const toggleZone = (zone: string) => {
    const current = formData.impact_zones;
    if (current.includes(zone)) {
      updateFormData({ impact_zones: current.filter((z) => z !== zone) });
    } else {
      updateFormData({ impact_zones: [...current, zone] });
    }
  };

  const toggleMotivation = (tag: string) => {
    const current = formData.motivation_tags;
    if (current.includes(tag)) {
      updateFormData({ motivation_tags: current.filter((t) => t !== tag) });
    } else {
      updateFormData({ motivation_tags: [...current, tag] });
    }
  };

  const toggleTechTool = (tool: string) => {
    const current = formData.tech_tools;
    if (current.includes(tool)) {
      updateFormData({ tech_tools: current.filter((t) => t !== tool) });
    } else {
      updateFormData({ tech_tools: [...current, tool] });
    }
  };

  const toggleMediaInterest = (interest: string) => {
    const current = formData.media_interests;
    if (current.includes(interest)) {
      updateFormData({ media_interests: current.filter((i) => i !== interest) });
    } else {
      updateFormData({ media_interests: [...current, interest] });
    }
  };

  const showTechTools = formData.impact_zones.includes("Tech & Digital");
  const showMediaInterests = formData.impact_zones.includes("Media & Design");

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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {impactZones.map((zone, index) => {
            const Icon = zone.icon;
            const isSelected = formData.impact_zones.includes(zone.id);
            return (
              <motion.button
                key={zone.id}
                type="button"
                onClick={() => toggleZone(zone.id)}
                className={cn("zone-card text-left", isSelected && "selected")}
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
            );
          })}
        </div>
      </div>

      {/* Conditional Tech Tools */}
      {showTechTools && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Label className="text-sm font-medium">Tech Tools you know</Label>
          <div className="flex flex-wrap gap-2">
            {techTools.map((tool) => (
              <button
                key={tool}
                type="button"
                onClick={() => toggleTechTool(tool)}
                className={cn(
                  "chip",
                  formData.tech_tools.includes(tool) && "selected"
                )}
              >
                {tool}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Conditional Media Interests */}
      {showMediaInterests && (
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Label className="text-sm font-medium">Media Interests</Label>
          <div className="flex flex-wrap gap-2">
            {mediaInterests.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleMediaInterest(interest)}
                className={cn(
                  "chip",
                  formData.media_interests.includes(interest) && "selected"
                )}
              >
                {interest}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Motivation Tags */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">What motivates you?</Label>
        <div className="flex flex-wrap gap-2">
          {motivationTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleMotivation(tag)}
              className={cn(
                "chip",
                formData.motivation_tags.includes(tag) && "selected"
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

export default Step2ImpactZones;
