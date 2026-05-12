import { useState, KeyboardEvent } from "react";
import { FormData } from "../OpportunistForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X, Sparkles } from "lucide-react";
import HelperText from "../shared/HelperText";
import { useT } from "@/contexts/LanguageContext";

interface Step4bProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const defaultFunTags = [
  "Hidden musician",
  "Photographer",
  "Gamer",
  "Amateur chef",
  "Plant parent",
  "Writer",
  "Speaker",
  "Editor",
  "Night owl",
  "Early bird",
  "Coffee addict",
  "Bookworm",
  "Traveler",
  "Fitness enthusiast",
  "Movie buff",
  "Podcast lover",
];

const Step4bFunTags = ({ formData, updateFormData }: Step4bProps) => {
  const t = useT();
  const [customTagInput, setCustomTagInput] = useState("");

  const getFunTagLabel = (tag: string) => {
    switch (tag) {
      case "Hidden musician": return t.opportunistForm.step4b.funTags.hiddenMusician;
      case "Photographer": return t.opportunistForm.step4b.funTags.photographer;
      case "Gamer": return t.opportunistForm.step4b.funTags.gamer;
      case "Amateur chef": return t.opportunistForm.step4b.funTags.amateurChef;
      case "Plant parent": return t.opportunistForm.step4b.funTags.plantParent;
      case "Writer": return t.opportunistForm.step4b.funTags.writer;
      case "Speaker": return t.opportunistForm.step4b.funTags.speaker;
      case "Editor": return t.opportunistForm.step4b.funTags.editor;
      case "Night owl": return t.opportunistForm.step4b.funTags.nightOwl;
      case "Early bird": return t.opportunistForm.step4b.funTags.earlyBird;
      case "Coffee addict": return t.opportunistForm.step4b.funTags.coffeeAddict;
      case "Bookworm": return t.opportunistForm.step4b.funTags.bookworm;
      case "Traveler": return t.opportunistForm.step4b.funTags.traveler;
      case "Fitness enthusiast": return t.opportunistForm.step4b.funTags.fitnessEnthusiast;
      case "Movie buff": return t.opportunistForm.step4b.funTags.movieBuff;
      case "Podcast lover": return t.opportunistForm.step4b.funTags.podcastLover;
      default: return tag;
    }
  };

  const toggleFunTag = (tag: string) => {
    const current = formData.fun_tags;
    if (current.includes(tag)) {
      updateFormData({ fun_tags: current.filter((t) => t !== tag) });
    } else {
      if (current.length >= 5) return;
      updateFormData({ fun_tags: [...current, tag] });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && customTagInput.trim()) {
      e.preventDefault();
      const newTag = customTagInput.trim();
      if (formData.fun_tags.length >= 5) return;
      if (!formData.fun_tags.includes(newTag)) {
        updateFormData({ fun_tags: [...formData.fun_tags, newTag] });
      }
      setCustomTagInput("");
    }
  };

  const removeCustomTag = (tag: string) => {
    updateFormData({ fun_tags: formData.fun_tags.filter((t) => t !== tag) });
  };

  // Custom tags are those not in the default list
  const customTags = formData.fun_tags.filter(
    (tag) => !defaultFunTags.includes(tag)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t.opportunistForm.step4b.title}
        </h2>
        <p className="text-muted-foreground">
          {t.opportunistForm.step4b.subtitle}
        </p>
      </div>

      {/* Fun Tags Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            {t.opportunistForm.step4b.anyFunTags}
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            {formData.fun_tags.length}/5
          </span>
        </Label>
        <HelperText>{t.opportunistForm.step4b.funTagsHint}</HelperText>
        <div className="flex flex-wrap gap-2">
          {defaultFunTags.map((tag) => {
            const isSelected = formData.fun_tags.includes(tag);
            const atCap = formData.fun_tags.length >= 5 && !isSelected;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleFunTag(tag)}
                disabled={atCap}
                className={cn(
                  "chip",
                  isSelected && "selected",
                  atCap && "opacity-40 cursor-not-allowed"
                )}
              >
                {getFunTagLabel(tag)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Tags Display */}
      {customTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">{t.opportunistForm.step4b.yourCustomTags}</Label>
          <div className="flex flex-wrap gap-2">
            {customTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/20 text-primary text-sm font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeCustomTag(tag)}
                  className="p-0.5 rounded-full hover:bg-primary/30 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Add Custom Tag */}
      <div className="space-y-2">
        <Label htmlFor="custom_tag" className="text-sm font-medium">
          {t.opportunistForm.step4b.addYourOwn}
        </Label>
        <HelperText>{t.opportunistForm.step4b.addHint}</HelperText>
        <Input
          id="custom_tag"
          type="text"
          placeholder={t.opportunistForm.step4b.customPlaceholder}
          value={customTagInput}
          onChange={(e) => setCustomTagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>
    </div>
  );
};

export default Step4bFunTags;