import { FormData } from "../PioneerForm";
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
import { useT } from "@/contexts/LanguageContext";

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const currentStatusOptions = ["Student", "Graduate", "Working", "Other"];
const Step1Basics = ({ formData, updateFormData }: Step1Props) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const t = useT();

  const educationLevels = [
    { value: "High School", label: t.pioneerForm.step1.educationLevels.highSchool },
    { value: "Undergraduate", label: t.pioneerForm.step1.educationLevels.undergraduate },
    { value: "Master's", label: t.pioneerForm.step1.educationLevels.masters },
    { value: "Graduated", label: t.pioneerForm.step1.educationLevels.graduated },
  ];

  const howFoundOptions = [
    { value: "Instagram", label: t.pioneerForm.step1.howFoundOptions.instagram },
    { value: "Friend", label: t.pioneerForm.step1.howFoundOptions.friend },
    { value: "Event", label: t.pioneerForm.step1.howFoundOptions.event },
    { value: "Website", label: t.pioneerForm.step1.howFoundOptions.website },
    { value: "WhatsApp", label: t.pioneerForm.step1.howFoundOptions.whatsapp },
    { value: "Other", label: t.pioneerForm.step1.howFoundOptions.other },
  ];

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
          {t.pioneerForm.step1.title}
        </h2>
        <p className="text-muted-foreground">{t.pioneerForm.step1.subtitle}</p>
      </div>

      {/* Full Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name" className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          {t.pioneerForm.step1.fullName} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder={t.pioneerForm.step1.fullNamePlaceholder}
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
          {t.pioneerForm.step1.email} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder={t.pioneerForm.step1.emailPlaceholder}
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
          {t.pioneerForm.step1.contactNumber}
        </Label>
        <Input
          id="contact_number"
          type="tel"
          placeholder={t.pioneerForm.step1.contactNumberPlaceholder}
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
          {t.pioneerForm.step1.whatsappNumber}
        </Label>
        <HelperText>{t.pioneerForm.step1.whatsappHint}</HelperText>
        <Input
          id="whatsapp_number"
          type="tel"
          placeholder={t.pioneerForm.step1.whatsappPlaceholder}
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
            {t.pioneerForm.step1.city} <span className="text-destructive">*</span>
          </Label>
          <HelperText>{t.pioneerForm.step1.cityHint}</HelperText>
          <Input
            id="city"
            type="text"
            placeholder={t.pioneerForm.step1.cityPlaceholder}
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
            {t.pioneerForm.step1.nationality} <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.nationality}
            onValueChange={(value) => {
              updateFormData({ nationality: value });
              handleBlur("nationality");
            }}
          >
            <SelectTrigger className={`bg-secondary/50 border-border ${errors.nationality ? "border-destructive" : ""}`}>
              <SelectValue placeholder={t.common.selectCountry} />
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
          {t.pioneerForm.step1.university}
        </Label>
        <Input
          id="university"
          type="text"
          placeholder={t.pioneerForm.step1.universityPlaceholder}
          value={formData.university}
          onChange={(e) => updateFormData({ university: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Department */}
      <div className="space-y-2">
        <Label htmlFor="department_of_study" className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          {t.pioneerForm.step1.departmentOfStudy}
        </Label>
        <Input
          id="department_of_study"
          type="text"
          placeholder={t.pioneerForm.step1.departmentPlaceholder}
          value={formData.department_of_study}
          onChange={(e) => updateFormData({ department_of_study: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Education Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          {t.pioneerForm.step1.educationLevel} <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.education_level}
          onValueChange={(value) => {
            updateFormData({ education_level: value });
            handleBlur("education_level");
          }}
        >
          <SelectTrigger className={`bg-secondary/50 border-border ${errors.education_level ? "border-destructive" : ""}`}>
            <SelectValue placeholder={t.pioneerForm.step1.selectEducationLevel} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {educationLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormFieldError error={errors.education_level || null} />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">{t.pioneerForm.step1.gender}</Label>
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
        <Label className="text-sm font-medium">{t.pioneerForm.step1.howFoundUs}</Label>
        <div className="flex flex-wrap gap-2">
          {howFoundOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => toggleReferral(option.value)}
              className={cn(
                "chip",
                formData.referral_source.includes(option.value) && "selected"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Step1Basics;
