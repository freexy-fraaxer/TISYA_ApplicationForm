import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderKanban } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const CollabStepProjectDetails = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <FolderKanban className="w-4 h-4" />
          Project Partner
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Project Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about the project collaboration
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="project_name" className="text-sm font-medium">
            Project Name
          </Label>
          <Input
            id="project_name"
            type="text"
            placeholder="Name of the project"
            value={formData.project_name}
            onChange={(e) => updateFormData({ project_name: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_summary" className="text-sm font-medium">
            Project Summary
          </Label>
          <Textarea
            id="project_summary"
            placeholder="What is the project about? What are the goals?"
            value={formData.project_summary}
            onChange={(e) => updateFormData({ project_summary: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-sm font-medium">
            Timeline
          </Label>
          <Input
            id="timeline"
            type="text"
            placeholder="e.g. Q2 2025, 3 months, ongoing"
            value={formData.timeline}
            onChange={(e) => updateFormData({ timeline: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="collaboration_scope" className="text-sm font-medium">
            Collaboration Scope
          </Label>
          <Textarea
            id="collaboration_scope"
            placeholder="What do you expect from this collaboration?"
            value={formData.collaboration_scope || ""}
            onChange={(e) => updateFormData({ collaboration_scope: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project_success" className="text-sm font-medium">
            What does success look like for you?
          </Label>
          <Textarea
            id="project_success"
            placeholder="How will you measure success?"
            value={formData.project_goals}
            onChange={(e) => updateFormData({ project_goals: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepProjectDetails;
