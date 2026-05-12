import { PathfinderFormData } from "../PathfinderForm";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Instagram, MessageCircle, Users, GraduationCap, Calendar, Globe, MoreHorizontal } from "lucide-react";
import PreSubmitSummary from "../shared/PreSubmitSummary";
import TermsAgreementCheckbox from "../shared/TermsAgreementCheckbox";
import { useT } from "@/contexts/LanguageContext";

interface Step3Props {
  formData: PathfinderFormData;
  updateFormData: (updates: Partial<PathfinderFormData>) => void;
}

const MemberStep3Finish = ({ formData, updateFormData }: Step3Props) => {
  const t = useT();

  const referralOptions = [
    { id: "Instagram", label: t.pathfinderForm.step3.referralOptions.instagram, icon: Instagram },
    { id: "WhatsApp", label: t.pathfinderForm.step3.referralOptions.whatsapp, icon: MessageCircle },
    { id: "Friend / Referral", label: t.pathfinderForm.step3.referralOptions.friendReferral, icon: Users },
    { id: "University / Campus", label: t.pathfinderForm.step3.referralOptions.universityCampus, icon: GraduationCap },
    { id: "Event / Workshop", label: t.pathfinderForm.step3.referralOptions.eventWorkshop, icon: Calendar },
    { id: "Website", label: t.pathfinderForm.step3.referralOptions.website, icon: Globe },
    { id: "Other", label: t.pathfinderForm.step3.referralOptions.other, icon: MoreHorizontal },
  ];
  const handleSourceSelect = (source: string) => {
    // Single selection, clear source_other if not selecting Other
    if (source !== "Other") {
      updateFormData({ 
        referral_source: [source],
        source_other: "" 
      });
    } else {
      updateFormData({ referral_source: [source] });
    }
  };

  const isOtherSelected = formData.referral_source.includes("Other");

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.pathfinderForm.step3.title}
        </h2>
        <p className="text-muted-foreground">
          {t.pathfinderForm.step3.subtitle}
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
          {t.pathfinderForm.step3.howDidYouHear}
        </Label>
        <div className="flex flex-wrap gap-3">
          {referralOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = formData.referral_source.includes(option.id);
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSourceSelect(option.id)}
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
        
        {/* Conditional Other text input */}
        {isOtherSelected && (
          <div className="mt-3">
            <Input
              placeholder={t.common.pleaseSpecify}
              value={formData.source_other || ""}
              onChange={(e) => updateFormData({ source_other: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
              maxLength={100}
            />
          </div>
        )}
      </div>

      {/* Consent Checkboxes */}
      <div className="space-y-4">
        <TermsAgreementCheckbox
          role="pathfinder"
          checked={formData.consent_data_storage}
          onCheckedChange={(checked) => updateFormData({ consent_data_storage: checked })}
        />

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
            {t.pathfinderForm.step3.consentUpdates}
          </label>
        </div>
      </div>
    </div>
  );
};

export default MemberStep3Finish;
