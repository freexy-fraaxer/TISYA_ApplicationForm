import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "@/components/HomePage";
import RoleSelection from "@/components/RoleSelection";
import SystemTransition from "@/components/SystemTransition";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";

type MissionRole = "operators" | "members" | "ambassador" | "countryunion" | "partner";

const PageTransition = ({ children, keyProp }: { children: React.ReactNode; keyProp: string }) => (
  <motion.div
    key={keyProp}
    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    style={{ willChange: "opacity, transform" }}
  >
    {children}
  </motion.div>
);

const Index = () => {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showSystemTransition, setShowSystemTransition] = useState(false);
  const { setBackgroundBlurred, triggerPulse } = useBackgroundEffects();

  const handleJoinClick = () => {
    triggerPulse();
    setShowSystemTransition(true);
  };

  const handleSystemTransitionComplete = useCallback(() => {
    setShowSystemTransition(false);
    setBackgroundBlurred(true);
    setShowRoleSelection(true);
  }, [setBackgroundBlurred]);

  const handleCloseRoles = () => {
    setShowRoleSelection(false);
    setBackgroundBlurred(false);
  };

  const handleSelectRole = (role: MissionRole) => {
    setShowRoleSelection(false);
    setBackgroundBlurred(false);
    // Navigate to a dedicated mission briefing page
    navigate(`/mission/${role}`);
  };

  return (
    <>
      <SystemTransition isActive={showSystemTransition} onComplete={handleSystemTransitionComplete} />

      <AnimatePresence mode="wait">
        <PageTransition keyProp="home">
          <HomePage onJoinClick={handleJoinClick} />
        </PageTransition>
      </AnimatePresence>

      <RoleSelection
        isOpen={showRoleSelection}
        onClose={handleCloseRoles}
        onSelectOperators={() => handleSelectRole("operators")}
        onSelectMembers={() => handleSelectRole("members")}
        onSelectAmbassador={() => handleSelectRole("ambassador")}
        onSelectCountryUnion={() => handleSelectRole("countryunion")}
        onSelectPartner={() => handleSelectRole("partner")}
      />
    </>
  );
};

export default Index;
