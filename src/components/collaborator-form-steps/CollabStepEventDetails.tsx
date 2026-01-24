import { CollaboratorFormData } from "../CollaboratorForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
}

const eventFormats = ["In-person", "Online", "Hybrid"];

const CollabStepEventDetails = ({ formData, updateFormData }: Props) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
          <Calendar className="w-4 h-4" />
          Event Partner
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Event Details
        </h2>
        <p className="text-muted-foreground">
          Tell us about the event you'd like to partner on
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="event_name" className="text-sm font-medium">
            Event Name
          </Label>
          <Input
            id="event_name"
            type="text"
            placeholder="Name of the event"
            value={formData.event_name}
            onChange={(e) => updateFormData({ event_name: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="event_date" className="text-sm font-medium">
              Event Date
            </Label>
            <Input
              id="event_date"
              type="text"
              placeholder="e.g. March 2025 or TBD"
              value={formData.event_date}
              onChange={(e) => updateFormData({ event_date: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Event Format</Label>
            <Select
              value={formData.event_format}
              onValueChange={(value) => updateFormData({ event_format: value })}
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {eventFormats.map((format) => (
                  <SelectItem key={format} value={format}>
                    {format}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expected_attendance" className="text-sm font-medium">
              Expected Attendance
            </Label>
            <Input
              id="expected_attendance"
              type="text"
              placeholder="e.g. 50-100 people"
              value={formData.expected_attendance}
              onChange={(e) => updateFormData({ expected_attendance: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target_audience" className="text-sm font-medium">
              Target Audience
            </Label>
            <Input
              id="target_audience"
              type="text"
              placeholder="e.g. Students, Professionals"
              value={formData.target_audience}
              onChange={(e) => updateFormData({ target_audience: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_description" className="text-sm font-medium">
            Event Description
          </Label>
          <Textarea
            id="event_description"
            placeholder="Brief description of the event..."
            value={formData.event_description}
            onChange={(e) => updateFormData({ event_description: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event_support_expected" className="text-sm font-medium">
            What support do you expect from TISYA?
          </Label>
          <Textarea
            id="event_support_expected"
            placeholder="e.g. Promotion, volunteers, speakers..."
            value={formData.event_support_expected || ""}
            onChange={(e) => updateFormData({ event_support_expected: e.target.value })}
            className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
};

export default CollabStepEventDetails;
