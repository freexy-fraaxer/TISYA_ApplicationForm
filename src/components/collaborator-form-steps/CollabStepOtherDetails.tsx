import { CollaboratorFormData } from "../CollaboratorForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const CollabStepOtherDetails = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <MoreHorizontal className="w-4 h-4" />
          Other Collaboration
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tell us more
        </h2>
        <p className="text-muted-foreground">
          Describe your collaboration idea
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="collab_description" className="text-sm font-medium">
            Describe your collaboration idea
          </Label>
          <Textarea
            id="collab_description"
            placeholder="What kind of collaboration do you have in mind?"
            value={formData.collab_description}
            onChange={(e) => updateFormData({ collab_description: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectations" className="text-sm font-medium">
            Your Expectations
          </Label>
          <Textarea
            id="expectations"
            placeholder="What do you expect from this collaboration?"
            value={formData.expectations}
            onChange={(e) => updateFormData({ expectations: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Additional Notes (optional)
          </Label>
          <Textarea
            id="notes"
            placeholder="Anything else you'd like to share?"
            value={formData.notes}
            onChange={(e) => updateFormData({ notes: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepOtherDetails;
