import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import RoleCard from "./RoleCard";
import { Users, Wrench, Flag, X, Building2, GraduationCap, Handshake } from "lucide-react";
import { useSound } from "@/contexts/SoundContext";

import pathfinderBg from "@/assets/role-pathfinder.png";
import operatorBg from "@/assets/role-operator.png";
import collaboratorBg from "@/assets/role-collaborator.png";
import internBg from "@/assets/role-intern.png";
import countryUnionBg from "@/assets/role-countryunion.png";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectAmbassador: () => void;
  onSelectCountryUnion: () => void;
  onSelectPartner: () => void;
}

const RoleSelection = ({ isOpen, onClose, onSelectOperators, onSelectMembers, onSelectAmbassador, onSelectCountryUnion, onSelectPartner }: RoleSelectionProps) => {
  const { 
    playAmbientTone, 
    playBack,
    playHover,
    playPathfinderSelect, 
    playOperatorSelect, 
    playAmbassadorSelect,
    playCountryUnionSelect,
    playInternSelect
  } = useSound();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      playAmbientTone();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen, playAmbientTone]);

  const handleClose = () => { playBack(); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ isolation: 'isolate', willChange: 'opacity' }}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[101]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{ 
              willChange: 'opacity',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              backgroundColor: 'rgba(5, 10, 25, 0.55)',
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-[102] w-full max-w-5xl py-6 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            style={{ willChange: 'opacity, transform' }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-2 right-0 md:right-4 p-2.5 rounded-full bg-secondary/50 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/30 transition-colors duration-150 z-[103]"
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.p
                className="text-xs font-mono uppercase tracking-[0.2em] text-primary/60 mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                Select Your Path
              </motion.p>
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-foreground mb-2 glow-text"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                Get Involved
              </motion.h2>
              <motion.p
                className="text-muted-foreground text-base"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Choose how you'd like to join TISYA.
              </motion.p>
            </div>

            {/* Role Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 max-w-4xl mx-auto px-2 md:px-4">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={playHover}
              >
                <RoleCard
                  title="Pathfinders"
                  label="Member"
                  description="Discover opportunities and navigate the TISYA network."
                  icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={pathfinderBg}
                  onClick={() => { playPathfinderSelect(); onSelectMembers(); }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={playHover}
              >
                <RoleCard
                  title="Operators"
                  label="Volunteer"
                  description="Create, manage, and bring ideas to life."
                  icon={<Wrench className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={operatorBg}
                  onClick={() => { playOperatorSelect(); onSelectOperators(); }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={playHover}
              >
                <RoleCard
                  title="Ambassador"
                  label="Individual"
                  description="Represent TISYA across your campus or country."
                  icon={<Flag className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={collaboratorBg}
                  onClick={() => { playAmbassadorSelect(); onSelectAmbassador(); }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={playHover}
              >
                <RoleCard
                  title="Country Union"
                  label="Organization"
                  description="Lead partnerships and represent organizations."
                  icon={<Building2 className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={countryUnionBg}
                  onClick={() => { playCountryUnionSelect(); onSelectCountryUnion(); }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={playHover}
              >
                <RoleCard
                  title="Partner / Sponsor"
                  label="Organization"
                  description="Collaborate with TISYA as an organization or sponsor."
                  icon={<Handshake className="w-5 h-5 md:w-6 md:h-6" />}
                  backgroundImage={operatorBg}
                  onClick={() => { playCountryUnionSelect(); onSelectPartner(); }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                onMouseEnter={() => playInternSelect()}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
