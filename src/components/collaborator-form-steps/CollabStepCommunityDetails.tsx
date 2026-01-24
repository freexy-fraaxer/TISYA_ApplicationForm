import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const CollabStepCommunityDetails = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Users className="w-4 h-4" />
          Community Partner
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Community Partnership
        </h2>
        <p className="text-muted-foreground">
          Tell us about your community collaboration
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="community_collab_type" className="text-sm font-medium">
            Type of Collaboration
          </Label>
          <Input
            id="community_collab_type"
            type="text"
            placeholder="e.g. Cross-promotion, Joint events, Resource sharing"
            value={formData.community_collab_type || ""}
            onChange={(e) => updateFormData({ community_collab_type: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community_size" className="text-sm font-medium">
            Community Size
          </Label>
          <Input
            id="community_size"
            type="text"
            placeholder="e.g. 500 members, 2k followers"
            value={formData.community_size || ""}
            onChange={(e) => updateFormData({ community_size: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community_target_audience" className="text-sm font-medium">
            Target Audience
          </Label>
          <Input
            id="community_target_audience"
            type="text"
            placeholder="Who is your community for?"
            value={formData.community_target_audience || ""}
            onChange={(e) => updateFormData({ community_target_audience: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="planned_activities" className="text-sm font-medium">
            Planned Activities
          </Label>
          <Textarea
            id="planned_activities"
            placeholder="What activities do you have in mind for this partnership?"
            value={formData.planned_activities || ""}
            onChange={(e) => updateFormData({ planned_activities: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="community_success" className="text-sm font-medium">
            What does success look like for you?
          </Label>
          <Textarea
            id="community_success"
            placeholder="How will you measure the success of this partnership?"
            value={formData.community_success || ""}
            onChange={(e) => updateFormData({ community_success: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepCommunityDetails;
