import { useRef } from "react";
import { FormData } from "../PioneerForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Zap, Calendar, Hammer, HeartHandshake, Megaphone, LayoutList } from "lucide-react";
import HelperText from "../shared/HelperText";
import { useT } from "@/contexts/LanguageContext";

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const hoursLabel = (val: number): string => {
  if (val <= 2) return "1–2";
  if (val <= 4) return "3–4";
  if (val <= 7) return "5–7";
  if (val <= 10) return "8–10";
  return "10+";
};

const Step4Schedule = ({ formData, updateFormData }: Props) => {
  const t = useT();

  const COMMITMENT_OPTIONS = [
    { value: "1 month", label: t.pioneerForm.step4.commitmentOptions.oneMonth.label, sub: t.pioneerForm.step4.commitmentOptions.oneMonth.sub, icon: Clock },
    { value: "3 months", label: t.pioneerForm.step4.commitmentOptions.threeMonths.label, sub: t.pioneerForm.step4.commitmentOptions.threeMonths.sub, icon: Zap },
    { value: "6+ months", label: t.pioneerForm.step4.commitmentOptions.sixPlusMonths.label, sub: t.pioneerForm.step4.commitmentOptions.sixPlusMonths.sub, icon: Calendar },
  ];

  const WORK_PREFERENCES = [
    { value: "Building things", label: t.pioneerForm.step4.workPreferences.buildingThings, icon: Hammer },
    { value: "Organizing and coordinating", label: t.pioneerForm.step4.workPreferences.organizingCoordinating, icon: LayoutList },
    { value: "Supporting behind the scenes", label: t.pioneerForm.step4.workPreferences.supportingBehindScenes, icon: HeartHandshake },
    { value: "Leading and facilitating", label: t.pioneerForm.step4.workPreferences.leadingFacilitating, icon: Megaphone },
  ];

  const WORK_STYLES = [
    { value: "Remote", label: t.pioneerForm.step4.workStyles.remote },
    { value: "In-person", label: t.pioneerForm.step4.workStyles.inPerson },
    { value: "Hybrid", label: t.pioneerForm.step4.workStyles.hybrid },
    { value: "Weekends", label: t.pioneerForm.step4.workStyles.weekends },
    { value: "Weekdays", label: t.pioneerForm.step4.workStyles.weekdays },
    { value: "Evenings", label: t.pioneerForm.step4.workStyles.evenings },
  ];

  return (
    <div className="space-y-8">

      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">{t.pioneerForm.step4.title}</h2>
        <p className="text-muted-foreground text-sm">{t.pioneerForm.step4.subtitle}</p>
        <p className="text-xs text-primary/70 italic">{t.pioneerForm.step4.beRealistic}</p>
      </div>

      {/* Commitment Duration */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          {t.pioneerForm.step4.commitmentDuration} <span className="text-destructive">*</span>
        </Label>
        <HelperText>{t.pioneerForm.step4.commitmentHint}</HelperText>
        <div className="grid grid-cols-3 gap-3">
          {COMMITMENT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const selected = formData.commitment_duration === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateFormData({ commitment_duration: opt.value })}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 rounded-xl border transition-all duration-200 text-left",
                  selected
                    ? "bg-primary/10 border-primary/50 shadow-[0_0_12px_rgba(56,189,248,0.12)]"
                    : "bg-secondary/30 border-border hover:border-primary/30"
                )}
              >
                <Icon className={cn("w-4 h-4 mb-1", selected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm font-semibold", selected ? "text-foreground" : "text-foreground/80")}>
                  {opt.label}
                </span>
                <span className="text-[11px] text-muted-foreground">{opt.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Work Preference */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          {t.pioneerForm.step4.howMakeImpact} <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          {WORK_PREFERENCES.map((pref) => {
            const Icon = pref.icon;
            const selected = formData.work_preference === pref.value;
            return (
              <button
                key={pref.value}
                type="button"
                onClick={() => updateFormData({ work_preference: pref.value })}
                className={cn(
                  "flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 text-left",
                  selected
                    ? "bg-primary/10 border-primary/50"
                    : "bg-secondary/30 border-border hover:border-primary/30"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0", selected ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-sm", selected ? "text-foreground font-medium" : "text-foreground/80")}>
                  {pref.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hours per week */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          {t.pioneerForm.step4.hoursPerWeek} <span className="text-destructive">*</span>
        </Label>
        <HelperText>{t.pioneerForm.step4.hoursHint}</HelperText>
        <div className="space-y-2">
          <div className="flex justify-between text-[11px] text-muted-foreground px-1">
            <span>1-2</span>
            <span>3-4</span>
            <span>5-7</span>
            <span>8-10</span>
            <span>10+</span>
          </div>
          <Slider
            value={[formData.hours_per_week]}
            onValueChange={([val]) => updateFormData({ hours_per_week: val })}
            min={1}
            max={12}
            step={1}
            className="w-full"
          />
          <p className="text-center text-sm font-medium text-primary">
            {hoursLabel(formData.hours_per_week)} {t.pioneerForm.step4.hoursWeek}
          </p>
        </div>
      </div>

      {/* Working Style */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">{t.pioneerForm.step4.workingStyle}</Label>
        <div className="flex flex-wrap gap-2">
          {WORK_STYLES.map((style) => {
            const selected = formData.skills?.includes(style.value);
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => {
                  const current = formData.skills || [];
                  const updated = current.includes(style.value)
                    ? current.filter((s: string) => s !== style.value)
                    : [...current, style.value];
                  updateFormData({ skills: updated });
                }}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200",
                  selected
                    ? "bg-primary/20 border-primary text-foreground"
                    : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Previous Volunteering */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          {t.pioneerForm.step4.volunteeredBefore} <span className="text-destructive">*</span>
        </Label>
        <div className="flex gap-2">
          {[{ value: "Yes", label: t.common.yes }, { value: "No", label: t.common.no }].map((opt) => {
            const isYes = opt.value === "Yes";
            const selected =
              formData.previous_volunteering === true && isYes ||
              formData.previous_volunteering === false && !isYes;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updateFormData({ previous_volunteering: isYes })}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium border transition-all duration-200",
                  selected
                    ? "bg-primary/20 border-primary text-foreground"
                    : "bg-secondary/40 border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Volunteering Experience (only if yes) */}
      <AnimatePresence>
        {formData.previous_volunteering === true && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden space-y-2"
          >
            <Label className="text-sm font-semibold">{t.pioneerForm.step4.tellExperience}</Label>
            <Textarea
              placeholder={t.pioneerForm.step4.experiencePlaceholder}
              value={formData.previous_volunteering_experience}
              onChange={(e) =>
                updateFormData({ previous_volunteering_experience: e.target.value })
              }
              rows={3}
              className="bg-secondary/50 border-border focus:border-primary resize-none"
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Step4Schedule;
