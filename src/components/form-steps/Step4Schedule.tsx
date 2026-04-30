import { useRef } from "react";
import { FormData } from "../OpportunistForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Clock, Zap, Calendar, Hammer, HeartHandshake, Megaphone } from "lucide-react";
import HelperText from "../shared/HelperText";
import { useSound } from "@/contexts/SoundContext";

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

const Step4Schedule = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">Schedule</h2>

      {/* Commitment Duration */}
      <select
        value={formData.commitment_duration}
        onChange={(e) =>
          updateFormData({ commitment_duration: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Select Commitment</option>
        <option value="1-3 months">1-3 months</option>
        <option value="3-6 months">3-6 months</option>
        <option value="6+ months">6+ months</option>
      </select>

      {/* Hours per week */}
      <input
        type="number"
        value={formData.hours_per_week}
        onChange={(e) =>
          updateFormData({ hours_per_week: Number(e.target.value) })
        }
        className="w-full border p-2 rounded"
        placeholder="Hours per week"
      />

      {/* Previous Volunteering */}
      <select
        value={
          formData.previous_volunteering === null
            ? ""
            : formData.previous_volunteering
            ? "yes"
            : "no"
        }
        onChange={(e) =>
          updateFormData({
            previous_volunteering: e.target.value === "yes",
          })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Previous Volunteering?</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      {/* Experience (only if yes) */}
      {formData.previous_volunteering && (
        <textarea
          value={formData.previous_volunteering_experience}
          onChange={(e) =>
            updateFormData({
              previous_volunteering_experience: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
          placeholder="Describe your experience"
        />
      )}

    </div>
  );
};

export default Step4Schedule;
