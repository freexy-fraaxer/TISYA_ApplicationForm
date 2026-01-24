import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Mic, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const CollabStepSpeakerDetails = ({ formData, updateFormData }: Props) => {
  const isProviding = formData.speaker_direction === "providing";
  const isNeed = formData.speaker_direction === "need";

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Mic className="w-4 h-4" />
          Speaker Partner
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Speaker Partnership
        </h2>
        <p className="text-muted-foreground">
          Tell us about your speaker collaboration needs
        </p>
      </div>

      <div className="space-y-4">
        {/* Speaker Direction Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">
            What type of speaker partnership? <span className="text-destructive">*</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ speaker_direction: "providing" })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                isProviding
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/30 hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <ArrowUpCircle className={cn("w-6 h-6", isProviding ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className={cn("font-medium", isProviding ? "text-primary" : "text-foreground")}>
                    We are providing speakers
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We have speakers available for your events
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateFormData({ speaker_direction: "need" })}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                isNeed
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary/30 hover:border-primary/50"
              )}
            >
              <div className="flex items-center gap-3">
                <ArrowDownCircle className={cn("w-6 h-6", isNeed ? "text-primary" : "text-muted-foreground")} />
                <div>
                  <p className={cn("font-medium", isNeed ? "text-primary" : "text-foreground")}>
                    We need speakers
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    We're looking for speakers from TISYA
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Conditional Fields */}
        <AnimatePresence mode="wait">
          {isProviding && (
            <motion.div
              key="providing"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="speaker_name" className="text-sm font-medium">
                  Speaker Name(s)
                </Label>
                <Input
                  id="speaker_name"
                  type="text"
                  placeholder="Name(s) of the speaker(s)"
                  value={formData.speaker_name}
                  onChange={(e) => updateFormData({ speaker_name: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaker_topic" className="text-sm font-medium">
                  Topic(s)
                </Label>
                <Input
                  id="speaker_topic"
                  type="text"
                  placeholder="What topic(s) can they speak about?"
                  value={formData.speaker_topic}
                  onChange={(e) => updateFormData({ speaker_topic: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaker_bio" className="text-sm font-medium">
                  Short Speaker Bio
                </Label>
                <Textarea
                  id="speaker_bio"
                  placeholder="Brief bio of the speaker(s)..."
                  value={formData.speaker_bio || ""}
                  onChange={(e) => updateFormData({ speaker_bio: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_format" className="text-sm font-medium">
                  Preferred Session Format
                </Label>
                <Input
                  id="session_format"
                  type="text"
                  placeholder="e.g. Keynote, Panel, Workshop"
                  value={formData.session_format || ""}
                  onChange={(e) => updateFormData({ session_format: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="speaker_profile_link" className="text-sm font-medium">
                  Speaker Profile Link (optional)
                </Label>
                <Input
                  id="speaker_profile_link"
                  type="url"
                  placeholder="LinkedIn or personal website"
                  value={formData.speaker_profile_link}
                  onChange={(e) => updateFormData({ speaker_profile_link: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </motion.div>
          )}

          {isNeed && (
            <motion.div
              key="need"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="requested_topic" className="text-sm font-medium">
                  Requested Topic
                </Label>
                <Input
                  id="requested_topic"
                  type="text"
                  placeholder="What topic do you need speakers for?"
                  value={formData.requested_topic}
                  onChange={(e) => updateFormData({ requested_topic: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_of_speakers" className="text-sm font-medium">
                  Number of Speakers Needed
                </Label>
                <Input
                  id="number_of_speakers"
                  type="text"
                  placeholder="e.g. 1-2, 3+"
                  value={formData.number_of_speakers}
                  onChange={(e) => updateFormData({ number_of_speakers: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience_type" className="text-sm font-medium">
                  Audience Type
                </Label>
                <Input
                  id="audience_type"
                  type="text"
                  placeholder="e.g. Students, Professionals, Mixed"
                  value={formData.audience_type || ""}
                  onChange={(e) => updateFormData({ audience_type: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session_format_need" className="text-sm font-medium">
                  Session Format
                </Label>
                <Input
                  id="session_format_need"
                  type="text"
                  placeholder="e.g. Keynote, Panel, Q&A, Workshop"
                  value={formData.session_format || ""}
                  onChange={(e) => updateFormData({ session_format: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-primary"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollabStepSpeakerDetails;
