import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "@/components/HomePage";
import SystemTransition from "@/components/SystemTransition";
import SEO from "@/components/SEO";
import { useBackgroundEffects } from "@/contexts/BackgroundEffectsContext";

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
  const [showSystemTransition, setShowSystemTransition] = useState(false);
  const { triggerPulse } = useBackgroundEffects();

  const handleJoinClick = () => {
    triggerPulse();
    setShowSystemTransition(true);
  };

  const handleSystemTransitionComplete = useCallback(() => {
    setShowSystemTransition(false);
    navigate("/roles");
  }, [navigate]);

  return (
    <>
      <SEO
        title="Join TİSYA — Pick Your Path in the Alliance"
        description="TİSYA is a global student-led alliance. Apply as a Pathfinder, Opportunist, Ambassador, or Partner and build with us."
        path="/"
        jsonLd={[
          { "@context": "https://schema.org", "@type": "Organization", name: "TİSYA", url: "https://wearetisya.lovable.app", logo: "https://wearetisya.lovable.app/tisya-logo.png" },
          { "@context": "https://schema.org", "@type": "WebSite", name: "TİSYA", url: "https://wearetisya.lovable.app" },
        ]}
      />
      <SystemTransition isActive={showSystemTransition} onComplete={handleSystemTransitionComplete} />

      <AnimatePresence mode="wait">
        <PageTransition keyProp="home">
          <HomePage onJoinClick={handleJoinClick} />
        </PageTransition>
      </AnimatePresence>
    </>
  );
};

export default Index;
