import { FormData } from "../OpportunistForm";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

const LANGUAGES = ["English", "Turkish", "Bangla", "Arabic","Deutsch","French","Spanish","Urdu","Bahasa","Mandarin","Russian","Hebrew","Japanese","Swahili","Korean","Tamil","Polish","Kazakh"];

const Step2bLanguages = ({ formData, updateFormData }: Props) => {
  const [customLang, setCustomLang] = useState("");

  const toggleLanguage = (lang: string) => {
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

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">Languages</h2>

      {/* Preset Languages */}
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => toggleLanguage(lang)}
            className={`px-3 py-1 rounded border ${
              formData.languages_known.includes(lang)
                ? "bg-primary text-white"
                : "bg-transparent"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {/* Custom Language Input */}
      <input
        value={customLang}
        placeholder="Add other language and press Enter"
        onChange={(e) => setCustomLang(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && customLang.trim()) {
            e.preventDefault();

            if (!formData.languages_known.includes(customLang.trim())) {
              updateFormData({
                languages_known: [
                  ...formData.languages_known,
                  customLang.trim(),
                ],
              });
            }

            setCustomLang("");
          }
        }}
        className="w-full border p-2 rounded"
      />

      {/* Primary Language */}
      <select
        value={formData.primary_language}
        onChange={(e) =>
          updateFormData({ primary_language: e.target.value })
        }
        className="w-full border p-2 rounded"
      >
        <option value="">Select Primary Language</option>
        {formData.languages_known.map((lang: string) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

    </div>
  );
};

export default Step2bLanguages;