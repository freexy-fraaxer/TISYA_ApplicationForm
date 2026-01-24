import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Camera } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const mediaTypes = ["Promotion", "Coverage", "Content creation"];
const platforms = ["Instagram", "YouTube", "Website", "Newsletter", "LinkedIn", "TikTok", "Other"];

const CollabStepMediaDetails = ({ formData, updateFormData }: Props) => {
  const toggleMediaType = (type: string) => {
    const current = formData.media_type || [];
    if (current.includes(type)) {
      updateFormData({ media_type: current.filter((t) => t !== type) });
    } else {
      updateFormData({ media_type: [...current, type] });
    }
  };

  const togglePlatform = (platform: string) => {
    const current = formData.platforms || [];
    if (current.includes(platform)) {
      updateFormData({ platforms: current.filter((p) => p !== platform) });
    } else {
      updateFormData({ platforms: [...current, platform] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Camera className="w-4 h-4" />
          Media Partner
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Media Partnership
        </h2>
        <p className="text-muted-foreground">
          Tell us about your media collaboration needs
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Type of Media Support
          </Label>
          <div className="flex flex-wrap gap-2">
            {mediaTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => toggleMediaType(type)}
                className={cn(
                  "chip",
                  (formData.media_type || []).includes(type) && "selected"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">
            Platforms
          </Label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <button
                key={platform}
                type="button"
                onClick={() => togglePlatform(platform)}
                className={cn(
                  "chip",
                  (formData.platforms || []).includes(platform) && "selected"
                )}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliverables" className="text-sm font-medium">
            Expected Deliverables
          </Label>
          <Textarea
            id="deliverables"
            placeholder="e.g. 3 posts, 1 video, story coverage..."
            value={formData.deliverables}
            onChange={(e) => updateFormData({ deliverables: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="posting_timeline" className="text-sm font-medium">
            Timeline
          </Label>
          <Input
            id="posting_timeline"
            type="text"
            placeholder="e.g. 2 weeks, before event, ongoing"
            value={formData.posting_timeline}
            onChange={(e) => updateFormData({ posting_timeline: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audience_reach" className="text-sm font-medium">
            Your Audience Reach
          </Label>
          <Input
            id="audience_reach"
            type="text"
            placeholder="e.g. 10k followers, 5k newsletter subscribers"
            value={formData.audience_reach}
            onChange={(e) => updateFormData({ audience_reach: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="past_work_link" className="text-sm font-medium">
            Past Work / Portfolio Link (optional)
          </Label>
          <Input
            id="past_work_link"
            type="url"
            placeholder="Link to previous collaborations or portfolio"
            value={formData.past_work_link}
            onChange={(e) => updateFormData({ past_work_link: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="media_success" className="text-sm font-medium">
            What does success look like for you?
          </Label>
          <Textarea
            id="media_success"
            placeholder="How will you measure the success of this partnership?"
            value={formData.media_success || ""}
            onChange={(e) => updateFormData({ media_success: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepMediaDetails;
