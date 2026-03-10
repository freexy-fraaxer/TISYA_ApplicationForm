import { useState, useMemo, memo, useEffect } from "react";
import WaveBackground from "@/components/WaveBackground";
import HomePage from "@/components/HomePage";
import RoleSelection from "@/components/RoleSelection";
import OperatorsForm from "@/components/OperatorsForm";
import MemberForm from "@/components/MemberForm";
import AmbassadorForm from "@/components/AmbassadorForm";
import CountryUnionForm from "@/components/CountryUnionForm";
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

type Screen = "home" | "operators" | "members" | "ambassador" | "countryunion";

const IndexContent = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const { backgroundBlurred, setBackgroundBlurred, triggerPulse, isPulsing } = useBackgroundEffects();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinClick = () => {
    triggerPulse();
    setBackgroundBlurred(true);
    setShowRoleSelection(true);
  };

  const handleCloseRoles = () => {
    setShowRoleSelection(false);
    setBackgroundBlurred(false);
  };

  const handleSelectOperators = () => { setShowRoleSelection(false); setCurrentScreen("operators"); };
  const handleSelectMembers = () => { setShowRoleSelection(false); setCurrentScreen("members"); };
  const handleSelectAmbassador = () => { setShowRoleSelection(false); setCurrentScreen("ambassador"); };
  const handleSelectCountryUnion = () => { setShowRoleSelection(false); setCurrentScreen("countryunion"); };

  const handleBackToHome = () => {
    setCurrentScreen("home");
    setShowRoleSelection(false);
    setBackgroundBlurred(false);
  };

  const memoizedHandlers = useMemo(() => ({
    handleJoinClick,
    handleCloseRoles,
    handleSelectOperators,
    handleSelectMembers,
    handleSelectAmbassador,
    handleSelectCountryUnion,
    handleBackToHome,
  }), []);

  const isInForm = currentScreen !== "home";

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SplashScreen isVisible={showSplash} />

      <div 
        className={`transition-all duration-500 ${isPulsing ? 'animate-heartbeat-pulse' : ''}`}
        style={{ position: 'fixed', inset: 0, zIndex: 0 }}
      >
        <WaveBackground isStatic={isInForm} />
      </div>

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
        {currentScreen === "ambassador" && (
          <PageTransition keyProp="ambassador">
            <AmbassadorForm onBack={memoizedHandlers.handleBackToHome} />
          </PageTransition>
        )}
        {currentScreen === "countryunion" && (
          <PageTransition keyProp="countryunion">
            <CountryUnionForm onBack={memoizedHandlers.handleBackToHome} />
          </PageTransition>
        )}
      </AnimatePresence>

      <RoleSelection
        isOpen={showRoleSelection}
        onClose={memoizedHandlers.handleCloseRoles}
        onSelectOperators={memoizedHandlers.handleSelectOperators}
        onSelectMembers={memoizedHandlers.handleSelectMembers}
        onSelectAmbassador={memoizedHandlers.handleSelectAmbassador}
        onSelectCountryUnion={memoizedHandlers.handleSelectCountryUnion}
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
