import { motion } from "framer-motion";
import { User } from "lucide-react";

interface PreSubmitSummaryProps {
  name: string;
  role: string;
  interests: string[];
  preferredImpact?: string;
}

const PreSubmitSummary = ({ name, role, interests, preferredImpact }: PreSubmitSummaryProps) => {
  const topInterests = interests.slice(0, 2);

  return (
    <motion.div
      className="p-4 rounded-xl bg-primary/5 border border-primary/20 mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-medium text-primary">Here's how we'll see you</h4>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Name:</span>
          <span className="font-medium text-foreground">{name || "—"}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Role:</span>
          <span className="font-medium text-foreground">{role}</span>
        </div>
        
        {topInterests.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-muted-foreground">Interests:</span>
            <div className="flex gap-1 flex-wrap">
              {topInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {preferredImpact && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Impact style:</span>
            <span className="font-medium text-foreground">{preferredImpact}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PreSubmitSummary;
