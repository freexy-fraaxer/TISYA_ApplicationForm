import { PathfinderFormData } from "../PathfinderForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, MapPin, Globe, GraduationCap, BookOpen, Phone } from "lucide-react";
import { countries, validateEmail, getEmailError, getRequiredError, getPhoneError } from "@/lib/validation";
import FormFieldError from "../shared/FormFieldError";
import { useState, useEffect, useRef } from "react";

interface Step1Props {
  formData: PathfinderFormData;
  updateFormData: (updates: Partial<PathfinderFormData>) => void;
}

const MemberStep1Basics = ({ formData, updateFormData }: Step1Props) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  
  // Refs for autofill detection
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const contactRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    if (touched.full_name) {
      newErrors.full_name = getRequiredError(formData.full_name, "Full name");
    }
    if (touched.email) {
      newErrors.email = getEmailError(formData.email);
    }
    if (touched.contact_number) {
      newErrors.contact_number = getRequiredError(formData.contact_number, "Contact number") || getPhoneError(formData.contact_number);
    }
    if (touched.nationality) {
      newErrors.nationality = getRequiredError(formData.nationality, "Nationality");
    }
    if (touched.university) {
      newErrors.university = getRequiredError(formData.university, "University");
    }
    setErrors(newErrors);
  }, [formData, touched]);

  // Autofill detection - check values on mount and periodically
  useEffect(() => {
    const checkAutofill = () => {
      if (fullNameRef.current && fullNameRef.current.value && !formData.full_name) {
        updateFormData({ full_name: fullNameRef.current.value });
      }
      if (emailRef.current && emailRef.current.value && !formData.email) {
        updateFormData({ email: emailRef.current.value });
      }
      if (contactRef.current && contactRef.current.value && !formData.contact_number) {
        updateFormData({ contact_number: contactRef.current.value });
      }
    };
    
    // Check immediately and after a short delay for browser autofill
    checkAutofill();
    const timer = setTimeout(checkAutofill, 100);
    const timer2 = setTimeout(checkAutofill, 500);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
    };
  }, []);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Handle input with autofill sync
  const handleInputChange = (field: keyof PathfinderFormData, value: string) => {
    updateFormData({ [field]: value });
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
          ref={fullNameRef}
          id="full_name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your full name"
          value={formData.full_name}
          onChange={(e) => handleInputChange("full_name", e.target.value)}
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
          ref={emailRef}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          onBlur={() => handleBlur("email")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.email ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.email || null} />
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contact_number" className="text-sm font-medium flex items-center gap-2">
          <Phone className="w-4 h-4 text-muted-foreground" />
          Contact Number <span className="text-destructive">*</span>
        </Label>
        <Input
          ref={contactRef}
          id="contact_number"
          name="tel"
          type="tel"
          autoComplete="tel"
          placeholder="+1 234 567 8900"
          value={formData.contact_number}
          onChange={(e) => handleInputChange("contact_number", e.target.value)}
          onBlur={() => handleBlur("contact_number")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_number ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.contact_number || null} />
      </div>

      {/* City & Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            City
          </Label>
          <Input
            id="city"
            name="city"
            type="text"
            autoComplete="address-level2"
            placeholder="Your city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className="bg-secondary/50 border-border focus:border-primary"
          />
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
              setTouched((prev) => ({ ...prev, nationality: true }));
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

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="university" className="text-sm font-medium flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-muted-foreground" />
          University <span className="text-destructive">*</span>
        </Label>
        <Input
          id="university"
          name="organization"
          type="text"
          autoComplete="organization"
          placeholder="Your university name"
          value={formData.university}
          onChange={(e) => handleInputChange("university", e.target.value)}
          onBlur={() => handleBlur("university")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.university ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.university || null} />
      </div>

      {/* Department of Study */}
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
          onChange={(e) => handleInputChange("department_of_study", e.target.value)}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>
    </div>
  );
};

export default MemberStep1Basics;
