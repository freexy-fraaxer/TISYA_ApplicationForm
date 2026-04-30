import { FormData } from "../OpportunistForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { User, Mail, Phone, MapPin, Globe, GraduationCap, BookOpen, Briefcase, MessageCircle } from "lucide-react";
import { countries, genderOptions, validateEmail, validatePhone, getEmailError, getPhoneError, getRequiredError } from "@/lib/validation";
import HelperText from "../shared/HelperText";
import FormFieldError from "../shared/FormFieldError";
import { useState, useEffect } from "react";

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const educationLevels = [
  "High School",
  "Undergraduate",
  "Master's",
  "Graduated",
];

const howFoundOptions = [
  "Instagram",
  "Friend",
  "Event",
  "Website",
  "WhatsApp",
  "Other",
];

const currentStatusOptions = ["Student", "Graduate", "Working", "Other"];
const Step1Basics = ({ formData, updateFormData }: Step1Props) => {
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
    if (touched.contact_number) {
      newErrors.contact_number = getPhoneError(formData.contact_number);
    }
    if (touched.whatsapp_number) {
      newErrors.whatsapp_number = getPhoneError(formData.whatsapp_number);
    }
    if (touched.city) {
      newErrors.city = getRequiredError(formData.city, "City");
    }
    if (touched.nationality) {
      newErrors.nationality = formData.nationality ? null : "Nationality is required";
    }
    if (touched.university) {
      newErrors.current_status = formData.university ? null : "Uni is required";
    }
    if (touched.education_level) {
      newErrors.education_level = formData.education_level ? null : "Education level is required";
    }
    setErrors(newErrors);
  }, [formData, touched]);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const toggleReferral = (option: string) => {
    const current = formData.referral_source;
    if (current.includes(option)) {
      updateFormData({ referral_source: current.filter((o) => o !== option) });
    } else {
      updateFormData({ referral_source: [...current, option] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Let's start with the basics
        </h2>
        <p className="text-muted-foreground">Tell us a bit about yourself</p>
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

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contact_number" className="text-sm font-medium flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          Contact Number
        </Label>
        <Input
          id="contact_number"
          type="tel"
          placeholder="+90 5XX XXX XXXX"
          value={formData.contact_number}
          onChange={(e) => updateFormData({ contact_number: e.target.value })}
          onBlur={() => handleBlur("contact_number")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_number ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.contact_number || null} />
      </div>

      {/* WhatsApp Number */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp_number" className="text-sm font-medium flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-muted-foreground" />
          WhatsApp Number
        </Label>
        <HelperText>Optional — only if different from contact number.</HelperText>
        <Input
          id="whatsapp_number"
          type="tel"
          placeholder="+90 5XX XXX XXXX"
          value={formData.whatsapp_number}
          onChange={(e) => updateFormData({ whatsapp_number: e.target.value })}
          onBlur={() => handleBlur("whatsapp_number")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.whatsapp_number ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.whatsapp_number || null} />
      </div>

      {/* City & Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            City <span className="text-destructive">*</span>
          </Label>
          <HelperText>Used for event opportunities and local coordination.</HelperText>
          <Input
            id="city"
            type="text"
            placeholder="City (Türkiye)"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            onBlur={() => handleBlur("city")}
            className={`bg-secondary/50 border-border focus:border-primary ${errors.city ? "border-destructive" : ""}`}
          />
          <FormFieldError error={errors.city || null} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Nationality <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => {
              updateFormData({ nationality: value });
              handleBlur("nationality");
            }}
          >
            <SelectTrigger className={`bg-secondary/50 border-border ${errors.nationality ? "border-destructive" : ""}`}>
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
          <FormFieldError error={errors.nationality || null} />
        </div>
      </div>

      {/* University (optional) */}
      <div className="space-y-2">
        <Label htmlFor="university" className="text-sm font-medium flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          University
        </Label>
        <Input
          id="university"
          type="text"
          placeholder="Your university name (optional)"
          value={formData.university}
          onChange={(e) => updateFormData({ university: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label htmlFor="department_of_study" className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          Department of Study
        </Label>
        <Input
          id="department_of_study"
          type="text"
          placeholder="e.g., Computer Science, Business Administration"
          value={formData.department_of_study}
          onChange={(e) => updateFormData({ department_of_study: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Education Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Education Level <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.education_level}
          onValueChange={(value) => {
            updateFormData({ education_level: value });
            handleBlur("education_level");
          }}
        >
          <SelectTrigger className={`bg-secondary/50 border-border ${errors.education_level ? "border-destructive" : ""}`}>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {educationLevels.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormFieldError error={errors.education_level || null} />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gender</Label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => !option.disabled && updateFormData({ gender: option.value })}
              disabled={option.disabled}
              className={cn(
                "chip",
                formData.gender === option.value && "selected",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {option.value}
            </button>
          ))}
        </div>
      </div>

      {/* How Found Us */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">How did you find us?</Label>
        <div className="flex flex-wrap gap-2">
          {howFoundOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => toggleReferral(option)}
              className={cn(
                "chip",
                formData.referral_source.includes(option) && "selected"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Basics;
