import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import WaveBackground from "@/components/WaveBackground";
import SplashScreen from "@/components/SplashScreen";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";

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

      {children}
    </div>
  );
};

export default AppShell;
