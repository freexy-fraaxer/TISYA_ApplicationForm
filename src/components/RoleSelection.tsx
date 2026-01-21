import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RoleCard from "./RoleCard";
import { Users, Wrench, Handshake, GraduationCap, X, ArrowLeft } from "lucide-react";

// Import role card background images
import pathfinderBg from "@/assets/role-pathfinder.png";
import operatorBg from "@/assets/role-operator.png";
import collaboratorBg from "@/assets/role-collaborator.png";
import internBg from "@/assets/role-intern.png";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectCollaborator: () => void;
}

const RoleSelection = ({ isOpen, onClose, onSelectOperators, onSelectMembers, onSelectCollaborator }: RoleSelectionProps) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ 
            isolation: 'isolate',
            willChange: 'opacity'
          }}
        >
          {/* Backdrop with blur and dark overlay */}
          <motion.div
            className="fixed inset-0 z-[101]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ 
              willChange: 'opacity',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              backgroundColor: 'rgba(5, 10, 20, 0.6)'
            }}
          />

          {/* Content container - no overflow, fits viewport */}
          <motion.div
            className="relative z-[102] w-full max-w-4xl px-4 py-4 md:py-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            style={{ 
              willChange: 'opacity, transform',
              maxHeight: '90vh'
            }}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-0 right-4 md:right-8 p-2.5 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150 z-[103]"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-4 md:mb-6">
              <motion.h2
                className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2 glow-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Choose your role
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-sm md:text-base"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Select a path to begin your journey.
              </motion.p>
            </div>

            {/* Role Cards Grid - fixed height cards to prevent overflow */}
            <div className="grid grid-cols-2 gap-2 md:gap-5 max-w-3xl w-full px-1 md:px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <RoleCard
                  title="Pathfinders"
                  label="Member"
                  description="Join the community, get access to resources and events."
                  icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={pathfinderBg}
                  onClick={onSelectMembers}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
              >
                <RoleCard
                  title="Operators"
                  label="Volunteer"
                  description="Help build programs, media, tech, and community."
                  icon={<Wrench className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={operatorBg}
                  onClick={onSelectOperators}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <RoleCard
                  title="Collaborator"
                  label="Partner"
                  description="Partner with TISYA for events, initiatives, and opportunities."
                  icon={<Handshake className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={collaboratorBg}
                  onClick={onSelectCollaborator}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
              >
                <RoleCard
                  title="Intern"
                  label="Intern"
                  description="Internship roles opening soon."
                  icon={<GraduationCap className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={internBg}
                  disabled
                  comingSoon
                />
              </motion.div>
            </div>

            {/* Back button */}
            <motion.button
              className="mt-4 md:mt-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm md:text-base">Back to home</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
