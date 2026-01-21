import { useState, useMemo, memo } from "react";
import WaveBackground from "@/components/WaveBackground";
import HomePage from "@/components/HomePage";
import RoleSelection from "@/components/RoleSelection";
import OperatorsForm from "@/components/OperatorsForm";
import MemberForm from "@/components/MemberForm";
import CollaboratorForm from "@/components/CollaboratorForm";
import { AnimatePresence, motion } from "framer-motion";

// Memoized page transition wrapper
const PageTransition = memo(({ children, keyProp }: { children: React.ReactNode; keyProp: string }) => (
  <motion.div
    key={keyProp}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.25 }}
    style={{ willChange: 'opacity' }}
  >
    {children}
  </motion.div>
));
PageTransition.displayName = 'PageTransition';

type Screen = "home" | "operators" | "members" | "collaborator";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleJoinClick = () => {
    setShowRoleSelection(true);
  };

  const handleCloseRoles = () => {
    setShowRoleSelection(false);
  };

  const handleSelectOperators = () => {
    setShowRoleSelection(false);
    setCurrentScreen("operators");
  };

  const handleSelectMembers = () => {
    setShowRoleSelection(false);
    setCurrentScreen("members");
  };

  const handleSelectCollaborator = () => {
    setShowRoleSelection(false);
    setCurrentScreen("collaborator");
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setShowRoleSelection(false);
  };

  // Memoize handlers to prevent prop changes causing re-renders
  const memoizedHandlers = useMemo(() => ({
    handleJoinClick,
    handleCloseRoles,
    handleSelectOperators,
    handleSelectMembers,
    handleSelectCollaborator,
    handleBackToHome,
  }), []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background - memoized, won't re-render */}
      <WaveBackground />

      {/* Main Content - simplified transitions using opacity only */}
      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <PageTransition keyProp="home">
            <HomePage onJoinClick={memoizedHandlers.handleJoinClick} />
          </PageTransition>
        )}

        {currentScreen === "operators" && (
          <PageTransition keyProp="operators">
            <OperatorsForm onBack={memoizedHandlers.handleBackToHome} />
          </PageTransition>
        )}

        {currentScreen === "members" && (
          <PageTransition keyProp="members">
            <MemberForm onBack={memoizedHandlers.handleBackToHome} />
          </PageTransition>
        )}

        {currentScreen === "collaborator" && (
          <PageTransition keyProp="collaborator">
            <CollaboratorForm onBack={memoizedHandlers.handleBackToHome} />
          </PageTransition>
        )}
      </AnimatePresence>

      {/* Role Selection Overlay */}
      <RoleSelection
        isOpen={showRoleSelection}
        onClose={memoizedHandlers.handleCloseRoles}
        onSelectOperators={memoizedHandlers.handleSelectOperators}
        onSelectMembers={memoizedHandlers.handleSelectMembers}
        onSelectCollaborator={memoizedHandlers.handleSelectCollaborator}
      />
    </div>
  );
};

export default Index;
