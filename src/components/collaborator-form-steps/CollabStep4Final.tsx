import { CollaboratorFormData } from "../CollaboratorForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock, Wallet, FileText, Target } from "lucide-react";
import HelperText from "../shared/HelperText";
import PreSubmitSummary from "../shared/PreSubmitSummary";

interface Step4Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const preferredTimelines = [
  "As soon as possible",
  "Within 1 month",
  "Within 3 months",
  "Within 6 months",
  "Flexible / No rush",
];

const budgetRanges = [
  "No budget",
  "Under $1,000",
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000+",
  "To be discussed",
];

const CollabStep4Final = ({ formData, updateFormData }: Step4Props) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Final details
        </h2>
        <p className="text-muted-foreground">Almost done</p>
      </div>

      {/* Pre-submit Summary */}
      <PreSubmitSummary
        name={formData.contact_name}
        role="Collaborator"
        interests={formData.collab_type}
      />

      {/* Preferred Timeline */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Preferred Timeline
        </Label>
        <Select
          value={formData.preferred_timeline}
          onValueChange={(value) => updateFormData({ preferred_timeline: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="When would you like to start?" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {preferredTimelines.map((timeline) => (
              <SelectItem key={timeline} value={timeline}>
                {timeline}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Budget Range */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Wallet className="w-4 h-4 text-muted-foreground" />
          Budget Range
        </Label>
        <Select
          value={formData.budget_range}
          onValueChange={(value) => updateFormData({ budget_range: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select budget range (optional)" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {budgetRanges.map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Success Definition */}
      <div className="space-y-2">
        <Label htmlFor="success_definition" className="text-sm font-medium flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          What does success look like for you in this collaboration?
        </Label>
        <HelperText>Clear goals help us build better partnerships.</HelperText>
        <Input
          id="success_definition"
          placeholder="e.g., Reach 500 attendees, launch a joint campaign..."
          value={formData.success_definition || ""}
          onChange={(e) => updateFormData({ success_definition: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additional_notes" className="text-sm font-medium flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          Additional Notes
        </Label>
        <HelperText>2–3 lines is more than enough.</HelperText>
        <Textarea
          id="additional_notes"
          placeholder="Anything else you'd like us to know?"
          value={formData.additional_notes}
          onChange={(e) => updateFormData({ additional_notes: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary min-h-[100px]"
        />
      </div>

      {/* Consent */}
      <div className="space-y-4 pt-4">
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
            I consent to TISYA storing my data for collaboration and communication purposes.{" "}
            <span className="text-destructive">*</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CollabStep4Final;
