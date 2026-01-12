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
import { motion } from "framer-motion";
import { Calendar, FolderKanban } from "lucide-react";

interface Step3Props {
  formData: CollaboratorFormData;
  updateFormData: (updates: Partial<CollaboratorFormData>) => void;
  showEventDetails: boolean;
  showProjectDetails: boolean;
}

const eventFormats = ["In-person", "Online", "Hybrid"];

const CollabStep3Details = ({
  formData,
  updateFormData,
  showEventDetails,
  showProjectDetails,
}: Step3Props) => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Tell us more
        </h2>
        <p className="text-muted-foreground">
          Share details about your {showEventDetails && showProjectDetails ? "event and project" : showEventDetails ? "event" : "project"}
        </p>
      </div>

      {/* Event Details Section */}
      {showEventDetails && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Event Details</h3>
          </div>

          {/* Event Name */}
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

          {/* Event Date & Format */}
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

          {/* Expected Attendance & Target Audience */}
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

          {/* Event Description */}
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
        </motion.div>
      )}

      {/* Project Details Section */}
      {showProjectDetails && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showEventDetails ? 0.1 : 0 }}
        >
          <div className="flex items-center gap-2 pb-2 border-b border-border/50">
            <FolderKanban className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Project Details</h3>
          </div>

          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project_name" className="text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="project_name"
              type="text"
              placeholder="Name of the project"
              value={formData.project_name}
              onChange={(e) => updateFormData({ project_name: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>

          {/* Project Summary */}
          <div className="space-y-2">
            <Label htmlFor="project_summary" className="text-sm font-medium">
              Project Summary
            </Label>
            <Textarea
              id="project_summary"
              placeholder="What is the project about? What are the goals?"
              value={formData.project_summary}
              onChange={(e) => updateFormData({ project_summary: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary min-h-[80px]"
            />
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label htmlFor="timeline" className="text-sm font-medium">
              Timeline
            </Label>
            <Input
              id="timeline"
              type="text"
              placeholder="e.g. Q2 2025, 3 months, ongoing"
              value={formData.timeline}
              onChange={(e) => updateFormData({ timeline: e.target.value })}
              className="bg-secondary/50 border-border focus:border-primary"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CollabStep3Details;
