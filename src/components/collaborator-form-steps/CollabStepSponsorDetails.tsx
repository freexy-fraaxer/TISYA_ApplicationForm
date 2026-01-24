import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { DollarSign } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const sponsorshipTypes = ["Financial", "In-kind", "Services", "Products"];

const CollabStepSponsorDetails = ({ formData, updateFormData }: Props) => {
  const toggleSponsorshipType = (type: string) => {
    const current = formData.sponsorship_type || [];
    if (current.includes(type)) {
      updateFormData({ sponsorship_type: current.filter((t) => t !== type) });
    } else {
      updateFormData({ sponsorship_type: [...current, type] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <DollarSign className="w-4 h-4" />
          Sponsor
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Sponsorship Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about your sponsorship interest
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Sponsorship Type
          </Label>
          <div className="flex flex-wrap gap-2">
            {sponsorshipTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleSponsorshipType(type)}
                className={cn(
                  "chip",
                  (formData.sponsorship_type || []).includes(type) && "selected"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="estimated_budget" className="text-sm font-medium">
            Budget Range (optional)
          </Label>
          <Input
            id="estimated_budget"
            type="text"
            placeholder="e.g. $500-1000, To be discussed"
            value={formData.estimated_budget}
            onChange={(e) => updateFormData({ estimated_budget: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="what_they_provide" className="text-sm font-medium">
            What will you provide?
          </Label>
          <Textarea
            id="what_they_provide"
            placeholder="Describe what you're offering as a sponsor..."
            value={formData.what_they_provide}
            onChange={(e) => updateFormData({ what_they_provide: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="what_they_expect" className="text-sm font-medium">
            What do you expect in return?
          </Label>
          <Textarea
            id="what_they_expect"
            placeholder="e.g. Logo placement, speaking slot, mentions..."
            value={formData.what_they_expect}
            onChange={(e) => updateFormData({ what_they_expect: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="brand_exposure" className="text-sm font-medium">
            Brand Exposure Expectations
          </Label>
          <Textarea
            id="brand_exposure"
            placeholder="How would you like your brand to be represented?"
            value={formData.brand_exposure}
            onChange={(e) => updateFormData({ brand_exposure: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepSponsorDetails;
