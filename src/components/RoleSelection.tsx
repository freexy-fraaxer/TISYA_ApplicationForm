import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/contexts/SoundContext";
import { useIsMobile } from "@/hooks/use-mobile";

import pathfinderBg from "@/assets/role-pathfinder-v2.png";
import operatorBg from "@/assets/role-operator-v2.png";
import partnerBg from "@/assets/role-partner-v2.png";
import internBg from "@/assets/role-intern-v2.png";
import ambassadorBg from "@/assets/role-ambassador-v2.png";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectAmbassador: () => void;
  onSelectCountryUnion: () => void; // kept for back-compat; no longer used
  onSelectPartner: () => void;
}

interface PanelProps {
  title: string;
  description: string;
  image: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  delay?: number;
}

const RolePanel = ({
  title,
  description,
  image,
  disabled = false,
  comingSoon = false,
  onClick,
  onHover,
  delay = 0,
}: PanelProps) => {
  const isMobile = useIsMobile();

  return (
    <motion.button
      type="button"
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={!disabled ? onHover : undefined}
      disabled={disabled}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={!disabled && !isMobile ? { y: -4 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      className={cn(
        "group relative flex-1 min-w-0 text-left focus:outline-none h-full overflow-hidden",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={{ willChange: "transform" }}
    >
      {/* Background image fills entire panel */}
      <div
        className={cn(
          "absolute inset-0 bg-center bg-cover transition-transform duration-700",
          !disabled && "group-hover:scale-[1.04]",
          disabled && "grayscale opacity-50"
        )}
        style={{ backgroundImage: `url(${image})` }}
      />

      {/* Subtle dark gradient for text legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, hsl(220 60% 4% / 0.55) 0%, hsl(220 60% 4% / 0.15) 35%, hsl(220 60% 4% / 0.25) 60%, hsl(220 60% 4% / 0.92) 100%)",
        }}
      />

      {/* Hover sheen */}
      {!disabled && (
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--primary) / 0.18) 0%, transparent 40%, transparent 60%, hsl(var(--primary) / 0.12) 100%)",
          }}
        />
      )}

      {/* Coming Soon ribbon */}
      {comingSoon && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30">
          <div
            className="px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm backdrop-blur-md"
            style={{
              background: "hsl(220 30% 6% / 0.75)",
              color: "hsl(var(--foreground) / 0.92)",
              border: "1px solid hsl(var(--foreground) / 0.3)",
            }}
          >
            Locked
          </div>
        </div>
      )}

      {/* Title — upper area */}
      <div className="absolute inset-x-0 top-[10%] md:top-[12%] z-10 px-3 text-center">
        <h3
          className="font-extrabold uppercase tracking-[0.08em] leading-[1.05] text-foreground"
          style={{
            fontSize: "clamp(1rem, 1.5vw, 1.65rem)",
            textShadow:
              "0 0 14px hsl(var(--primary) / 0.6), 0 2px 8px hsl(220 60% 3% / 0.95)",
          }}
        >
          {title}
        </h3>
      </div>

      {/* Description — bottom */}
      <div className="absolute inset-x-0 bottom-6 md:bottom-8 z-10 px-4 md:px-5 text-center">
        <p
          className="text-[11px] md:text-[13px] leading-snug font-medium"
          style={{
            color: "hsl(0 0% 100% / 0.95)",
            textShadow: "0 1px 6px hsl(220 60% 3% / 0.98), 0 0 14px hsl(220 60% 3% / 0.9)",
          }}
        >
          {description}
        </p>
      </div>
    </motion.button>
  );
};

// Zigzag vertical divider rendered between panels
const ZigzagDivider = () => (
  <div
    className="hidden lg:block absolute inset-y-0 w-[2px] z-20 pointer-events-none"
    style={{
      // converted to inline placement via parent positioning
    }}
  >
    <svg
      className="h-full w-[14px] -translate-x-1/2"
      viewBox="0 0 14 100"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline
        points="7,0 0,5 14,10 0,15 14,20 0,25 14,30 0,35 14,40 0,45 14,50 0,55 14,60 0,65 14,70 0,75 14,80 0,85 14,90 0,95 7,100"
        fill="none"
        stroke="hsl(var(--primary) / 0.85)"
        strokeWidth="0.8"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / 0.7))" }}
      />
    </svg>
  </div>
);

const RoleSelection = ({
  isOpen,
  onClose,
  onSelectOperators,
  onSelectMembers,
  onSelectAmbassador,
  onSelectPartner,
}: RoleSelectionProps) => {
  const {
    playAmbientTone,
    playBack,
    playHover,
    playPathfinderSelect,
    playOperatorSelect,
    playCountryUnionSelect,
    playInternSelect,
  } = useSound();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      playAmbientTone();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, playAmbientTone]);

  const handleClose = () => {
    playBack();
    onClose();
  };

  // Suppress unused (Ambassador is locked now)
  void onSelectAmbassador;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          style={{ isolation: "isolate" }}
        >
          {/* Blurred backdrop */}
          <motion.div
            className="fixed inset-0 z-[101]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            style={{
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              backgroundColor: "rgba(5, 10, 25, 0.7)",
            }}
          />

          {/* Content — fills entire screen */}
          <motion.div
            className="relative z-[102] flex flex-col w-full h-full"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 shrink-0">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2
                  className="text-xl md:text-3xl font-extrabold uppercase tracking-[0.14em] text-foreground"
                  style={{
                    textShadow:
                      "0 0 14px hsl(var(--primary) / 0.55), 0 0 28px hsl(var(--primary) / 0.25)",
                  }}
                >
                  Choose Your Path
                </h2>
                <motion.div
                  className="mt-2 h-[2px] w-full max-w-[220px] md:max-w-[320px] rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.55 }}
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), transparent)",
                    boxShadow: "0 0 10px hsl(var(--primary) / 0.7)",
                  }}
                />
              </motion.div>

              <motion.button
                className="p-2.5 rounded-full bg-secondary/60 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/40 transition-colors duration-150"
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Outer container with neon border surrounding the connected cards */}
            <div className="flex-1 px-3 md:px-6 pb-4 md:pb-6 min-h-0">
              <div
                className="relative h-full w-full overflow-hidden"
                style={{
                  border: "1.5px solid hsl(var(--primary) / 0.7)",
                  boxShadow:
                    "0 0 24px hsl(var(--primary) / 0.35), inset 0 0 30px hsl(var(--primary) / 0.12)",
                  borderRadius: "4px",
                }}
              >
                {/* Panels grid — connected, no gaps */}
                <div className="relative h-full w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0">
                  <div className="relative h-full">
                    <RolePanel
                      title="Pathfinder"
                      description="Discover opportunities and navigate the TISYA network."
                      image={pathfinderBg}
                      delay={0.1}
                      onHover={playHover}
                      onClick={() => {
                        playPathfinderSelect();
                        onSelectMembers();
                      }}
                    />
                  </div>

                  <div className="relative h-full">
                    {/* Zigzag divider on left edge */}
                    <div className="absolute inset-y-0 left-0 z-30 pointer-events-none">
                      <ZigzagDivider />
                    </div>
                    <RolePanel
                      title="Opportunist"
                      description="Create, manage, and bring ideas to life as an operator."
                      image={operatorBg}
                      delay={0.15}
                      onHover={playHover}
                      onClick={() => {
                        playOperatorSelect();
                        onSelectOperators();
                      }}
                    />
                  </div>

                  <div className="relative h-full">
                    <div className="absolute inset-y-0 left-0 z-30 pointer-events-none">
                      <ZigzagDivider />
                    </div>
                    <RolePanel
                      title="Partner / Sponsor"
                      description="Build powerful alliances and provide key support."
                      image={partnerBg}
                      delay={0.2}
                      onHover={playHover}
                      onClick={() => {
                        playCountryUnionSelect();
                        onSelectPartner();
                      }}
                    />
                  </div>

                  <div className="relative h-full">
                    <div className="absolute inset-y-0 left-0 z-30 pointer-events-none">
                      <ZigzagDivider />
                    </div>
                    <RolePanel
                      title="Intern"
                      description="Gain valuable experience and assist key projects."
                      image={internBg}
                      delay={0.25}
                      disabled
                      comingSoon
                      onHover={playInternSelect}
                    />
                  </div>

                  <div className="relative h-full">
                    <div className="absolute inset-y-0 left-0 z-30 pointer-events-none">
                      <ZigzagDivider />
                    </div>
                    <RolePanel
                      title="Ambassador"
                      description="Represent TISYA across your campus or country."
                      image={ambassadorBg}
                      delay={0.3}
                      disabled
                      comingSoon
                      onHover={playHover}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer hint */}
            <motion.div
              className="flex items-center justify-end gap-4 px-4 md:px-8 pb-3 md:pb-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] shrink-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ color: "hsl(var(--foreground) / 0.55)" }}
            >
              <button
                onClick={handleClose}
                className="flex items-center gap-2 hover:text-foreground transition-colors"
              >
                <span
                  className="inline-flex w-4 h-4 items-center justify-center rounded-full border"
                  style={{ borderColor: "hsl(var(--foreground) / 0.4)" }}
                >
                  ×
                </span>
                Back
              </button>
              <span className="flex items-center gap-2">
                <span
                  className="inline-flex w-4 h-4 items-center justify-center rounded-full border"
                  style={{ borderColor: "hsl(var(--primary) / 0.6)", color: "hsl(var(--primary))" }}
                >
                  ◎
                </span>
                Select
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
