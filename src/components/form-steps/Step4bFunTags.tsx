import { useState, KeyboardEvent } from "react";
import { FormData } from "../OpportunistForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { X, Sparkles } from "lucide-react";
import HelperText from "../shared/HelperText";

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
  const [customTagInput, setCustomTagInput] = useState("");

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
          Fun facts about you
        </h2>
        <p className="text-muted-foreground">
          Help us get to know the real you
        </p>
      </div>

      {/* Fun Tags Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            Any fun tags?
          </span>
          <span className="text-xs text-muted-foreground font-normal">
            {formData.fun_tags.length}/5
          </span>
        </Label>
        <HelperText>Pick up to 5, or add your own.</HelperText>
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
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Tags Display */}
      {customTags.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Your custom tags</Label>
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
          Add your own
        </Label>
        <HelperText>Type something and press Enter to add.</HelperText>
        <Input
          id="custom_tag"
          type="text"
          placeholder="e.g., Tea enthusiast, Cat person..."
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