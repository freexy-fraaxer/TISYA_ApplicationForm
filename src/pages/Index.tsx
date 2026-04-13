import { useState, useMemo, memo, useEffect, useCallback } from "react";
import WaveBackground from "@/components/WaveBackground";
import HomePage from "@/components/HomePage";
import RoleSelection from "@/components/RoleSelection";
import SystemTransition from "@/components/SystemTransition";
import MissionBrief from "@/components/MissionBrief";
import OperatorsForm from "@/components/OperatorsForm";
import MemberForm from "@/components/MemberForm";
import AmbassadorForm from "@/components/AmbassadorForm";
import CountryUnionForm from "@/components/CountryUnionForm";
import PartnerSponsorForm from "@/components/PartnerSponsorForm";
import SplashScreen from "@/components/SplashScreen";
import { AnimatePresence, motion } from "framer-motion";
import { SoundProvider } from "@/contexts/SoundContext";
import { BackgroundEffectsProvider, useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";

const PageTransition = memo(({ children, keyProp }: { children: React.ReactNode; keyProp: string }) => (
  <motion.div
    key={keyProp}
    initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    style={{ willChange: 'opacity, transform' }}
  >
    {children}
  </motion.div>
));
PageTransition.displayName = 'PageTransition';

type Screen = "home" | "operators" | "members" | "ambassador" | "countryunion" | "partner";
type MissionRole = "operators" | "members" | "ambassador" | "countryunion" | "partner";

const IndexContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showSystemTransition, setShowSystemTransition] = useState(false);
  const [missionRole, setMissionRole] = useState<MissionRole | null>(null);
  const { setBackgroundBlurred, triggerPulse, isPulsing } = useBackgroundEffects();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

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
    setMissionRole(role);
  };

  const handleAcceptMission = () => {
    if (missionRole) {
      setCurrentScreen(missionRole);
      setMissionRole(null);
    }
  };

  const handleBackFromMission = () => {
    setMissionRole(null);
    setShowRoleSelection(true);
  };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setShowRoleSelection(false);
    setBackgroundBlurred(false);
    setMissionRole(null);
  };

  const isInForm = currentScreen !== "home";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SplashScreen isVisible={showSplash} />
      <SystemTransition isActive={showSystemTransition} onComplete={handleSystemTransitionComplete} />

      <div 
        className={`transition-all duration-500 ${isPulsing ? 'animate-heartbeat-pulse' : ''}`}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      >
        <WaveBackground isStatic={isInForm} />
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === "home" && !missionRole && (
          <PageTransition keyProp="home">
            <HomePage onJoinClick={handleJoinClick} />
          </PageTransition>
        )}
        {missionRole && currentScreen === "home" && (
          <PageTransition keyProp={`mission-${missionRole}`}>
            <MissionBrief
              role={missionRole}
              onAccept={handleAcceptMission}
              onBack={handleBackFromMission}
            />
          </PageTransition>
        )}
        {currentScreen === "operators" && (
          <PageTransition keyProp="operators">
            <OperatorsForm onBack={handleBackToHome} />
          </PageTransition>
        )}
        {currentScreen === "members" && (
          <PageTransition keyProp="members">
            <MemberForm onBack={handleBackToHome} />
          </PageTransition>
        )}
        {currentScreen === "ambassador" && (
          <PageTransition keyProp="ambassador">
            <AmbassadorForm onBack={handleBackToHome} />
          </PageTransition>
        )}
        {currentScreen === "countryunion" && (
          <PageTransition keyProp="countryunion">
            <CountryUnionForm onBack={handleBackToHome} />
          </PageTransition>
        )}
        {currentScreen === "partner" && (
          <PageTransition keyProp="partner">
            <PartnerSponsorForm onBack={handleBackToHome} />
          </PageTransition>
        )}
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
    </div>
  );
};

const Index = () => {
  return (
    <BackgroundEffectsProvider>
      <SoundProvider>
        <IndexContent />
      </SoundProvider>
    </BackgroundEffectsProvider>
  );
};

export default Index;
