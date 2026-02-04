import { MemberFormData } from "../MemberForm";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Mail, MessageCircle, Instagram } from "lucide-react";
import PreSubmitSummary from "../shared/PreSubmitSummary";

interface Step3Props {
  formData: MemberFormData;
  updateFormData: (updates: Partial<MemberFormData>) => void;
}

const referralOptions = [
  { id: "Email", label: "Email", icon: Mail },
  { id: "WhatsApp", label: "WhatsApp", icon: MessageCircle },
  { id: "Instagram", label: "Instagram", icon: Instagram },
];

const MemberStep3Finish = ({ formData, updateFormData }: Step3Props) => {
  const toggleReferral = (source: string) => {
    const current = formData.referral_source;
    if (current.includes(source)) {
      updateFormData({ referral_source: current.filter((c) => c !== source) });
    } else {
      updateFormData({ referral_source: [...current, source] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Almost there
        </h2>
        <p className="text-muted-foreground">
          Just a few more things before you join
        </p>
      </div>

      {/* Pre-submit Summary */}
      <PreSubmitSummary
        name={formData.full_name}
        role="Pathfinder"
        interests={formData.interests}
      />

      {/* How did you hear about us */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          How did you hear about us?
        </Label>
        <div className="flex flex-wrap gap-3">
          {referralOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.referral_source.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => toggleReferral(option.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all duration-300",
                  isSelected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/50 bg-secondary/30 text-muted-foreground hover:border-primary/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
          <Checkbox
            id="consent_data_storage"
            checked={formData.consent_data_storage}
            onCheckedChange={(checked) =>
              updateFormData({ consent_data_storage: checked === true })
            }
            className="mt-0.5"
          />
          <label
            htmlFor="consent_data_storage"
            className="text-sm text-foreground leading-relaxed cursor-pointer"
          >
            I consent to TISYA storing my data for community and communication purposes.{" "}
            <span className="text-destructive">*</span>
          </label>
        </div>

        <div className="flex items-start space-x-3 p-4 rounded-lg bg-secondary/30 border border-border/50">
          <Checkbox
            id="consent_updates"
            checked={formData.consent_updates}
            onCheckedChange={(checked) =>
              updateFormData({ consent_updates: checked === true })
            }
            className="mt-0.5"
          />
          <label
            htmlFor="consent_updates"
            className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            I'd like to receive updates about events and opportunities.
          </label>
        </div>
      </div>
    </div>
  );
};

export default MemberStep3Finish;
