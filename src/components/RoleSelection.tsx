import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import RoleCard from "./RoleCard";
import { Users, Wrench, Handshake, GraduationCap, X, ArrowLeft } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

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
  const { playAmbientTone, playTick } = useSound();

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Play ambient tone when modal opens
      playAmbientTone();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, playAmbientTone]);

  // Handler with tick sound for role selection
  const handleRoleSelect = (callback: () => void) => {
    playTick();
    callback();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
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
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{ 
              willChange: 'opacity',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              backgroundColor: 'rgba(10, 15, 30, 0.45)',
            }}
          />

          {/* Content - higher z-index to stay above backdrop with scale-in animation */}
          <motion.div
            className="relative z-[102] w-full max-w-4xl py-6 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-2 right-0 md:right-4 p-2.5 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150 z-[103]"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
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
                className="text-muted-foreground text-base"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Select a path to begin your journey.
              </motion.p>
            </div>

            {/* Role Cards Grid - 2x2 on both mobile and desktop */}
            <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-3xl mx-auto px-2 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <RoleCard
                  title="Pathfinders"
                  label="Member"
                  description="Join the community, get access to resources and events."
                  icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={pathfinderBg}
                  onClick={() => handleRoleSelect(onSelectMembers)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <RoleCard
                  title="Operators"
                  label="Volunteer"
                  description="Help build programs, media, tech, and community."
                  icon={<Wrench className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={operatorBg}
                  onClick={() => handleRoleSelect(onSelectOperators)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <RoleCard
                  title="Collaborator"
                  label="Partner"
                  description="Partner with TISYA for events, initiatives, and opportunities."
                  icon={<Handshake className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={collaboratorBg}
                  onClick={() => handleRoleSelect(onSelectCollaborator)}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
              className="mt-8 mx-auto flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
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
