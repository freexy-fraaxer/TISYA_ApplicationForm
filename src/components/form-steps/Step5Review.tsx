import { FormData } from "../OpportunistForm";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import PreSubmitSummary from "../shared/PreSubmitSummary";
import CommitmentModal from "../shared/CommitmentModal";
import TermsAgreementCheckbox from "../shared/TermsAgreementCheckbox";

interface Step5Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const Step5Review = ({ formData, updateFormData }: Step5Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Ready to launch?
        </h2>
        <p className="text-muted-foreground">
          Review your application and hit submit
        </p>
      </div>

      {/* Pre-submit Summary */}
      <PreSubmitSummary
        name={formData.full_name}
        role="Opportunist"
        interests={formData.impact_zones}
      />

      {/* Summary Card */}
      <div className="glass-card p-6 space-y-4">
        <h3 className="font-semibold text-foreground mb-4">Application Summary</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <p className="font-medium text-foreground">{formData.full_name}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium text-foreground">{formData.email}</p>
          </div>
          <div>
            <span className="text-muted-foreground">City:</span>
            <p className="font-medium text-foreground">{formData.city}</p>
          </div>
          <div>
            <span className="text-muted-foreground">University:</span>
            <p className="font-medium text-foreground">{formData.university}</p>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Impact Zones:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.impact_zones.map((zone) => (
                <span
                  key={zone}
                  className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted-foreground">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-xs"
                >
                  {skill}
                </span>
              ))}
              {formData.skills.length > 5 && (
                <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                  +{formData.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Commitment:</span>
            <p className="font-medium text-foreground">{formData.commitment_duration}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Hours/week:</span>
            <p className="font-medium text-foreground">{formData.hours_per_week}</p>
          </div>
        </div>
      </div>

      {/* Commitment Checkbox */}
      <CommitmentModal
        roleName="Opportunist"
        checked={formData.consent_commitment}
        onCheckedChange={(checked) => updateFormData({ consent_commitment: checked })}
      />

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <TermsAgreementCheckbox
          role="opportunist"
          checked={formData.consent_data_storage}
          onCheckedChange={(checked) =>
            updateFormData({ consent_data_storage: checked })
          }
          showError={!formData.consent_data_storage}
        />

        <div className="flex items-start gap-3">
          <Checkbox
            id="consent_updates"
            checked={formData.consent_updates}
            onCheckedChange={(checked) =>
              updateFormData({ consent_updates: checked as boolean })
            }
            className="mt-0.5 border-border"
          />
          <Label
            htmlFor="consent_updates"
            className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
          >
            I'd like to receive updates about events & opportunities.
          </Label>
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
