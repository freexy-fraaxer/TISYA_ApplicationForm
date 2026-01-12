import { CollaboratorFormData } from "../CollaboratorForm";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Calendar,
  FolderKanban,
  DollarSign,
  Mic,
  Camera,
  MoreHorizontal,
} from "lucide-react";

interface Step2Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const collabTypes = [
  {
    id: "Event Partnership",
    label: "Event Partnership",
    description: "Co-host or sponsor events together",
    icon: Calendar,
  },
  {
    id: "Project Collaboration",
    label: "Project Collaboration",
    description: "Work on shared initiatives and projects",
    icon: FolderKanban,
  },
  {
    id: "Sponsorship",
    label: "Sponsorship",
    description: "Financial or in-kind support",
    icon: DollarSign,
  },
  {
    id: "Speaker / Panel",
    label: "Speaker / Panel",
    description: "Participate as a speaker or panelist",
    icon: Mic,
  },
  {
    id: "Media Partnership",
    label: "Media Partnership",
    description: "Content sharing and cross-promotion",
    icon: Camera,
  },
  {
    id: "Other",
    label: "Other",
    description: "Something else in mind",
    icon: MoreHorizontal,
  },
];

const CollabStep2Type = ({ formData, updateFormData }: Step2Props) => {
  const toggleType = (type: string) => {
    const current = formData.collab_type;
    if (current.includes(type)) {
      updateFormData({ collab_type: current.filter((t) => t !== type) });
    } else {
      updateFormData({ collab_type: [...current, type] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Type of collaboration
        </h2>
        <p className="text-muted-foreground">
          Select all that apply
        </p>
      </div>

      {/* Collaboration Types Grid */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          What kind of collaboration are you interested in? <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {collabTypes.map((type, index) => {
            const Icon = type.icon;
            const isSelected = formData.collab_type.includes(type.id);
            return (
              <motion.button
                key={type.id}
                type="button"
                onClick={() => toggleType(type.id)}
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
                      {type.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {type.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CollabStep2Type;
