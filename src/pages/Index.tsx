import { useState } from "react";
import ParticleBackground from "@/components/ParticleBackground";
import HomePage from "@/components/HomePage";
import RoleSelection from "@/components/RoleSelection";
import OperatorsForm from "@/components/OperatorsForm";
import { AnimatePresence, motion } from "framer-motion";

type Screen = "home" | "roles" | "operators";

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

  const handleBackFromForm = () => {
    setCurrentScreen("home");
    setShowRoleSelection(true);
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setShowRoleSelection(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <ParticleBackground />

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {currentScreen === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomePage onJoinClick={handleJoinClick} />
          </motion.div>
        )}

        {currentScreen === "operators" && (
          <motion.div
            key="operators"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            <OperatorsForm onBack={handleBackToHome} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Selection Overlay */}
      <RoleSelection
        isOpen={showRoleSelection}
        onClose={handleCloseRoles}
        onSelectOperators={handleSelectOperators}
      />
    </div>
  );
};

export default Index;
