import { FormData } from "../OperatorsForm";
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

interface Step1Props {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const countries = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria",
  "Azerbaijan", "Bangladesh", "Belarus", "Belgium", "Bosnia and Herzegovina", "Brazil",
  "Bulgaria", "Canada", "Chile", "China", "Colombia", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany",
  "Greece", "Hungary", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Japan", "Jordan", "Kazakhstan", "Kenya", "Kosovo", "Kuwait", "Kyrgyzstan", "Latvia",
  "Lebanon", "Libya", "Lithuania", "Malaysia", "Mexico", "Moldova", "Mongolia", "Morocco",
  "Netherlands", "New Zealand", "Nigeria", "North Macedonia", "Norway", "Pakistan",
  "Palestine", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
  "Saudi Arabia", "Serbia", "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan",
  "Thailand", "Tunisia", "Turkey", "Turkmenistan", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uzbekistan", "Vietnam", "Yemen", "Other"
];

const educationLevels = [
  "High School",
  "Undergraduate",
  "Master's",
  "PhD",
  "Graduated",
  "Other",
];

const genderOptions = ["Male", "Female", "Other", "Prefer not to say"];

const howFoundOptions = [
  "Instagram",
  "Friend",
  "Event",
  "Website",
  "WhatsApp",
  "Other",
];

const Step1Basics = ({ formData, updateFormData }: Step1Props) => {
  const toggleHowFound = (option: string) => {
    const current = formData.how_found_us;
    if (current.includes(option)) {
      updateFormData({ how_found_us: current.filter((o) => o !== option) });
    } else {
      updateFormData({ how_found_us: [...current, option] });
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
        <Label htmlFor="full_name" className="text-sm font-medium">
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="full_name"
          type="text"
          placeholder="Your full name"
          value={formData.full_name}
          onChange={(e) => updateFormData({ full_name: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@email.com"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* Contact Number */}
      <div className="space-y-2">
        <Label htmlFor="contact_number" className="text-sm font-medium">
          Contact Number
        </Label>
        <Input
          id="contact_number"
          type="tel"
          placeholder="+90 5XX XXX XXXX"
          value={formData.contact_number}
          onChange={(e) => updateFormData({ contact_number: e.target.value })}
          className="bg-secondary/50 border-border focus:border-primary"
        />
      </div>

      {/* City & Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium">
            City <span className="text-destructive">*</span>
          </Label>
          <Input
            id="city"
            type="text"
            placeholder="City (Türkiye)"
            value={formData.city}
            onChange={(e) => updateFormData({ city: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality" className="text-sm font-medium">
            Nationality <span className="text-destructive">*</span>
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
      </div>

      {/* University */}
      <div className="space-y-2">
        <Label htmlFor="university" className="text-sm font-medium">
          University <span className="text-destructive">*</span>
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

      {/* Education Level */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Education Level <span className="text-destructive">*</span>
        </Label>
        <Select
          value={formData.education_level}
          onValueChange={(value) => updateFormData({ education_level: value })}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
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
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Gender</Label>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateFormData({ gender: option })}
              className={cn("chip", formData.gender === option && "selected")}
            >
              {option}
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
              onClick={() => toggleHowFound(option)}
              className={cn(
                "chip",
                formData.how_found_us.includes(option) && "selected"
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
