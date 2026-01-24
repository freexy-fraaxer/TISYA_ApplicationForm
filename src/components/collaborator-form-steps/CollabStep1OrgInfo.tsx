import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, User, Briefcase, Mail, Globe, MapPin } from "lucide-react";
import { validateEmail, validateUrl, getEmailError, getUrlError, getRequiredError } from "@/lib/validation";
import FormFieldError from "../shared/FormFieldError";
import { useState, useEffect } from "react";

interface Step1Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const orgTypes = [
  "NGO / Non-profit",
  "University / Academic",
  "Corporate / Company",
  "Government / Public Sector",
  "Media / Publication",
  "Startup",
  "Individual / Freelance",
  "Other",
];

const CollabStep1OrgInfo = ({ formData, updateFormData }: Step1Props) => {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const newErrors: Record<string, string | null> = {};
    if (touched.org_name) {
      newErrors.org_name = getRequiredError(formData.org_name, "Organization name");
    }
    if (touched.contact_name) {
      newErrors.contact_name = getRequiredError(formData.contact_name, "Contact name");
    }
    if (touched.email) {
      newErrors.email = getEmailError(formData.email);
    }
    if (touched.website) {
      newErrors.website = getUrlError(formData.website, "website URL");
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
          Collaboration Request
        </h2>
        <p className="text-muted-foreground">Tell us about your organization</p>
      </div>

      {/* Organization Name */}
      <div className="space-y-2">
        <Label htmlFor="org_name" className="text-sm font-medium flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          Organization Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="org_name"
          type="text"
          placeholder="Your organization or company name"
          value={formData.org_name}
          onChange={(e) => updateFormData({ org_name: e.target.value })}
          onBlur={() => handleBlur("org_name")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.org_name ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.org_name || null} />
      </div>

      {/* Contact Name */}
      <div className="space-y-2">
        <Label htmlFor="contact_name" className="text-sm font-medium flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          Contact Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="contact_name"
          type="text"
          placeholder="Your full name"
          value={formData.contact_name}
          onChange={(e) => updateFormData({ contact_name: e.target.value })}
          onBlur={() => handleBlur("contact_name")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.contact_name ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.contact_name || null} />
      </div>

      {/* Role Title */}
      <div className="space-y-2">
        <Label htmlFor="role_title" className="text-sm font-medium flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          Role / Title
        </Label>
        <Input
          id="role_title"
          type="text"
          placeholder="e.g. Partnership Manager"
          value={formData.role_title}
          onChange={(e) => updateFormData({ role_title: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
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
          placeholder="you@organization.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          onBlur={() => handleBlur("email")}
          className={`bg-secondary/50 border-border focus:border-primary ${errors.email ? "border-destructive" : ""}`}
        />
        <FormFieldError error={errors.email || null} />
      </div>

      {/* Website & Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="website" className="text-sm font-medium flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            Website
          </Label>
          <Input
            id="website"
            type="url"
            placeholder="https://yourwebsite.com"
            value={formData.website}
            onChange={(e) => updateFormData({ website: e.target.value })}
            onBlur={() => handleBlur("website")}
            className={`bg-secondary/50 border-border focus:border-primary ${errors.website ? "border-destructive" : ""}`}
          />
          <FormFieldError error={errors.website || null} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="City, Country"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Organization Type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Organization Type</Label>
        <Select
          value={formData.org_type}
          onValueChange={(value) => updateFormData({ org_type: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            {orgTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CollabStep1OrgInfo;
