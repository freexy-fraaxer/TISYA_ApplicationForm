import { motion, AnimatePresence } from "framer-motion";
import RoleCard from "./RoleCard";
import { Users, Wrench, Handshake, GraduationCap, X, ArrowLeft } from "lucide-react";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectCollaborator: () => void;
}

const RoleSelection = ({ isOpen, onClose, onSelectOperators, onSelectMembers, onSelectCollaborator }: RoleSelectionProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className="relative z-10 w-full max-w-5xl py-8"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-2 right-0 md:right-4 p-2.5 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-200"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-10">
              <motion.h2
                className="text-3xl md:text-5xl font-bold text-foreground mb-3 glow-text"
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
                Select a path to begin your journey.
              </motion.p>
            </div>

            {/* Role Cards Grid - 2x2 on desktop, stacked on mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto px-4">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RoleCard
                  title="Pathfinders"
                  label="Members"
                  description="Join the community, get access to resources & events."
                  icon={<Users className="w-7 h-7" />}
                  onClick={onSelectMembers}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RoleCard
                  title="Operators"
                  label="Volunteers"
                  description="Help build programs, media, tech, and community."
                  icon={<Wrench className="w-7 h-7" />}
                  onClick={onSelectOperators}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <RoleCard
                  title="Collaborator"
                  description="Partner with TISYA for events, initiatives, and opportunities."
                  icon={<Handshake className="w-7 h-7" />}
                  onClick={onSelectCollaborator}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <RoleCard
                  title="Intern"
                  description="Internship roles opening soon."
                  icon={<GraduationCap className="w-7 h-7" />}
                  disabled
                  comingSoon
                />
              </motion.div>
            </div>

            {/* Back button */}
            <motion.button
              className="mt-10 mx-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to home</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
