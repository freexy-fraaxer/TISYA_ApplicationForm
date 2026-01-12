import { motion, AnimatePresence } from "framer-motion";
import RoleCard from "./RoleCard";
import { Users, Wrench, Handshake, GraduationCap, X, ArrowLeft } from "lucide-react";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
}

const RoleSelection = ({ isOpen, onClose, onSelectOperators }: RoleSelectionProps) => {
  const handleComingSoon = (role: string) => {
    // Could show a toast or modal
    console.log(`${role} coming soon`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-4xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-12 right-0 md:right-4 p-2 rounded-full bg-secondary/50 text-foreground hover:bg-secondary transition-colors duration-200"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-6 h-6" />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-2 glow-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Choose your role
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Select a path to begin.
              </motion.p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RoleCard
                  title="Pathfinders"
                  label="Members"
                  description="Join the community, get access to resources & events."
                  icon={<Users />}
                  onClick={() => handleComingSoon("Pathfinders")}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RoleCard
                  title="Operators"
                  label="Volunteers"
                  description="Help build programs, media, tech, and community."
                  icon={<Wrench />}
                  onClick={onSelectOperators}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RoleCard
                  title="Collaborator"
                  description="Partner with TİSYA for events, initiatives, and opportunities."
                  icon={<Handshake />}
                  onClick={() => handleComingSoon("Collaborator")}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <RoleCard
                  title="Intern"
                  description="Internship roles opening soon."
                  icon={<GraduationCap />}
                  disabled
                  comingSoon
                />
              </motion.div>
            </div>

            {/* Back button */}
            <motion.button
              className="mt-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
