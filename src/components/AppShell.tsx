import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WaveBackground from "@/components/WaveBackground";
import SplashScreen from "@/components/SplashScreen";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";
import LanguagePicker from "@/components/LanguagePicker";

interface AppShellProps {
  children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation();
  const [showSplash, setShowSplash] = useState(true);
  const { isPulsing } = useBackgroundEffects();

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  // Forms feel calmer with a static background
  const isInForm = location.pathname.startsWith("/join/");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <SplashScreen isVisible={showSplash} />

      <div
        className={`transition-all duration-500 ${isPulsing ? "animate-heartbeat-pulse" : ""}`}
        style={{ position: "fixed", inset: 0, zIndex: 0 }}
      >
        <WaveBackground isStatic={isInForm} />
      </div>

      {/* Persistent global header with Language Picker */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 flex justify-end pointer-events-none">
        <div className="pointer-events-auto">
          <LanguagePicker />
        </div>
      </div>

      {children}
    </div>
  );
};

export default AppShell;
