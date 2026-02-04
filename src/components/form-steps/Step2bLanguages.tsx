import { FormData } from "../OperatorsForm";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import HelperText from "../shared/HelperText";

interface Step2bProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const languageOptions = [
  "English",
  "Turkish",
  "Arabic",
  "French",
  "Spanish",
  "German",
  "Russian",
  "Chinese",
  "Japanese",
  "Korean",
  "Portuguese",
  "Italian",
  "Hindi",
  "Urdu",
  "Persian",
  "Indonesian",
  "Malay",
  "Vietnamese",
  "Thai",
  "Dutch",
  "Polish",
  "Ukrainian",
  "Greek",
  "Hebrew",
  "Swedish",
  "Other",
];

const Step2bLanguages = ({ formData, updateFormData }: Step2bProps) => {
  const toggleLanguage = (language: string) => {
    const current = formData.languages_known;
    if (current.includes(language)) {
      updateFormData({ languages_known: current.filter((l) => l !== language) });
    } else {
      updateFormData({ languages_known: [...current, language] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Languages
        </h2>
        <p className="text-muted-foreground">
          What languages do you speak?
        </p>
      </div>

      {/* Languages Known */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Languages className="w-4 h-4 text-muted-foreground" />
          Languages Known
        </Label>
        <HelperText>Select all that apply.</HelperText>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((language) => (
            <button
              key={language}
              type="button"
              onClick={() => toggleLanguage(language)}
              className={cn(
                "chip",
                formData.languages_known.includes(language) && "selected"
              )}
            >
              {language}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Language */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Primary Language <span className="text-destructive">*</span>
        </Label>
        <HelperText>Which language are you most comfortable communicating in?</HelperText>
        <Select
          value={formData.primary_language}
          onValueChange={(value) => updateFormData({ primary_language: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select primary language" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-60">
            {languageOptions.map((language) => (
              <SelectItem key={language} value={language}>
                {language}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default Step2bLanguages;