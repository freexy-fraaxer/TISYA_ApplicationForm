import { MemberFormData } from "../MemberForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Globe, GraduationCap, BookOpen } from "lucide-react";
import { countries, validateEmail, getEmailError, getRequiredError } from "@/lib/validation";
import FormFieldError from "../shared/FormFieldError";
import { useState, useEffect } from "react";

interface Step1Props {
  formData: MemberFormData;
  updateFormData: (updates: Partial<MemberFormData>) => void;
}

const MemberStep1Basics = ({ formData, updateFormData }: Step1Props) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    if (touched.full_name) {
      newErrors.full_name = getRequiredError(formData.full_name, "Full name");
    }
    if (touched.email) {
      newErrors.email = getEmailError(formData.email);
    }
    setErrors(newErrors);
  }, [formData, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Welcome, Pathfinder
        </h2>
        <p className="text-muted-foreground">Let's get you started</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Your full name"
          value={formData.full_name}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          onBlur={() => handleBlur("full_name")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.full_name ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.full_name || null} />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@email.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          onBlur={() => handleBlur("email")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.email ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.email || null} />
      </div>

      {/* Nationality */}
      <div className="space-y-2">
        <Label htmlFor="nationality" className="text-sm font-medium flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          Nationality
        </Label>
        <Select
          value={formData.nationality}
          onValueChange={(value) => updateFormData({ nationality: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border max-h-60">
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="university" className="text-sm font-medium flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          University
        </Label>
        <Input
          id="university"
          type="text"
          placeholder="Your university name"
          value={formData.university}
          onChange={(e) => updateFormData({ university: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Department of Study */}
      <div className="space-y-2">
        <Label htmlFor="department" className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          Department of Study
        </Label>
        <Input
          id="department"
          type="text"
          placeholder="e.g., Computer Science, Business Administration"
          value={formData.department}
          onChange={(e) => updateFormData({ department: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>
    </div>
  );
};

export default MemberStep1Basics;
