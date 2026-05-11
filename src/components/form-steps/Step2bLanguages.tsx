import { FormData } from "../OpportunistForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

import { useState } from "react";

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const LANGUAGES = [
  "English", "Turkish", "Arabic", "French", "Spanish", "German",
  "Russian", "Chinese", "Japanese", "Korean", "Portuguese", "Italian",
  "Bangla", "Urdu", "Persian", "Indonesian", "Malay", "Vietnamese",
  "Thai", "Dutch", "Polish", "Ukrainian", "Greek", "Hebrew",
  "Swedish", "Other",
];

const Step2bLanguages = ({ formData, updateFormData }: Props) => {
  const isCustomLang = formData.primary_language !== "" && !LANGUAGES.includes(formData.primary_language);
  const [isOtherPrimary, setIsOtherPrimary] = useState(isCustomLang || formData.primary_language === "Other");

  // State for Languages Known 'Other' field
  const customKnownLangInArray = formData.languages_known.find((l: string) => !LANGUAGES.includes(l) && l !== "Other") || "";
  const [customKnownLang, setCustomKnownLang] = useState(customKnownLangInArray);
  const [isOtherKnown, setIsOtherKnown] = useState(!!customKnownLangInArray || formData.languages_known.includes("Other"));

  const toggleLanguage = (lang: string) => {
    if (lang === "Other") {
      if (isOtherKnown) {
        setIsOtherKnown(false);
        updateFormData({
          languages_known: formData.languages_known.filter((l: string) => l !== "Other" && l !== customKnownLang),
        });
        setCustomKnownLang("");
      } else {
        setIsOtherKnown(true);
        updateFormData({
          languages_known: [...formData.languages_known, "Other"],
        });
      }
      return;
    }

    const exists = formData.languages_known.includes(lang);
    if (exists) {
      updateFormData({
        languages_known: formData.languages_known.filter((l: string) => l !== lang),
      });
    } else {
      updateFormData({
        languages_known: [...formData.languages_known, lang],
      });
    }
  };

  const handleCustomKnownChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setCustomKnownLang(newVal);
    
    const filteredArray = formData.languages_known.filter((l: string) => l !== "Other" && l !== customKnownLang);
    
    if (newVal.trim() === "") {
      updateFormData({ languages_known: Array.from(new Set([...filteredArray, "Other"])) });
    } else {
      updateFormData({ languages_known: Array.from(new Set([...filteredArray, newVal])) });
    }
  };

  return (
    <div className="space-y-8">

      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Languages</h2>
        <p className="text-muted-foreground text-sm">What languages do you speak?</p>
      </div>

      {/* Primary Language */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">
          Primary Language <span className="text-destructive">*</span>
        </Label>
        <HelperText>Which language are you most comfortable communicating in?</HelperText>
        <Select
          value={isOtherPrimary ? "Other" : formData.primary_language}
          onValueChange={(v) => {
            if (v === "Other") {
              setIsOtherPrimary(true);
              updateFormData({ primary_language: "" }); // Reset so user can type
            } else {
              setIsOtherPrimary(false);
              updateFormData({ primary_language: v });
            }
          }}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select primary language" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {LANGUAGES.map((lang: string) => (
              <SelectItem key={lang} value={lang}>
                {lang}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Custom Language Input */}
        {isOtherPrimary && (
          <Input
            placeholder="Please specify your primary language"
            value={!LANGUAGES.includes(formData.primary_language) ? formData.primary_language : ""}
            onChange={(e) => updateFormData({ primary_language: e.target.value })}
            className="mt-2 bg-secondary/50 border-border focus:border-primary"
            autoFocus
          />
        )}
      </div>

      {/* Languages Known */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold flex items-center gap-2">
          <Languages className="w-4 h-4 text-muted-foreground" />
          Languages Known
        </Label>
        <HelperText>Select all that apply.</HelperText>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleLanguage(lang)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                (lang === "Other" && isOtherKnown) || (lang !== "Other" && formData.languages_known.includes(lang))
                  ? "bg-primary/20 border-primary text-foreground shadow-[0_0_8px_rgba(56,189,248,0.15)]"
                  : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Custom Known Language Input */}
        {isOtherKnown && (
          <Input
            placeholder="Please specify other languages"
            value={customKnownLang}
            onChange={handleCustomKnownChange}
            className="mt-2 bg-secondary/50 border-border focus:border-primary"
            autoFocus
          />
        )}
      </div>

      {/* Language Proficiency */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Language Proficiency</Label>
        <HelperText>Write like: English (Fluent), Turkish (Intermediate)</HelperText>
        <Textarea
          placeholder="English (Fluent), Turkish (Intermediate)"
          value={formData.language_proficiency}
          onChange={(e) => {
            if (e.target.value.length <= 300)
              updateFormData({ language_proficiency: e.target.value });
          }}
          rows={3}
          className="bg-secondary/50 border-border focus:border-primary resize-none"
        />
        <div className="flex justify-end">
          <span className="text-xs text-muted-foreground">
            {formData.language_proficiency?.length || 0}/300
          </span>
        </div>
      </div>

    </div>
  );
};

export default Step2bLanguages;