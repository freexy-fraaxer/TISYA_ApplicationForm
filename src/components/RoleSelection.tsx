import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/contexts/SoundContext";
import { useIsMobile } from "@/hooks/use-mobile";

import pathfinderBg from "@/assets/role-pathfinder.png";
import operatorBg from "@/assets/role-operator.png";
import collaboratorBg from "@/assets/role-collaborator.png";
import internBg from "@/assets/role-intern.png";
import partnerBg from "@/assets/role-countryunion.png"; // globe image reused for Partner/Sponsor

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectAmbassador: () => void;
  onSelectCountryUnion: () => void; // kept for back-compat; no longer used
  onSelectPartner: () => void;
}

type AccentKey = "violet" | "magenta" | "gold" | "emerald" | "cyan";

// Each accent in HSL — bright neon to match the reference
const ACCENTS: Record<AccentKey, { glow: string; text: string }> = {
  violet:  { glow: "270 95% 65%", text: "275 100% 88%" },
  magenta: { glow: "340 95% 60%", text: "345 100% 88%" },
  gold:    { glow: "42 100% 60%", text: "45 100% 85%" },
  emerald: { glow: "140 90% 55%", text: "140 100% 85%" },
  cyan:    { glow: "190 100% 60%", text: "190 100% 85%" },
};

interface PanelProps {
  title: string;
  description: string;
  image: string;
  accent: AccentKey;
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
  accent,
  disabled = false,
  comingSoon = false,
  onClick,
  onHover,
  delay = 0,
}: PanelProps) => {
  const isMobile = useIsMobile();
  const a = ACCENTS[accent];

  // Chamfered frame using clip-path (cuts top-left & bottom-right corners)
  const chamfer =
    "polygon(22px 0, 100% 0, 100% calc(100% - 22px), calc(100% - 22px) 100%, 0 100%, 0 22px)";

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
      whileHover={!disabled && !isMobile ? { y: -6 } : undefined}
      whileTap={!disabled ? { scale: 0.985 } : undefined}
      className={cn(
        "group relative flex-1 min-w-0 text-left focus:outline-none h-full",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={{ willChange: "transform" }}
    >
      {/* Outer accent halo (subtle on edges, intense on hover) */}
      <div
        className="absolute -inset-[2px] pointer-events-none transition-opacity duration-300 opacity-60 group-hover:opacity-100"
        style={{
          clipPath: chamfer,
          background: `hsl(${a.glow})`,
          boxShadow: `0 0 30px hsl(${a.glow} / 0.7), 0 0 60px hsl(${a.glow} / 0.4)`,
          filter: "blur(0.5px)",
        }}
      />

      {/* Inner panel body — full-bleed image */}
      <div
        className={cn(
          "relative overflow-hidden h-full w-full",
          disabled && "grayscale-[60%] opacity-85"
        )}
        style={{
          clipPath: chamfer,
          background: "hsl(220 50% 5%)",
        }}
      >
        {/* Background image fills entire panel */}
        <div
          className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-[1.05]"
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Vertical accent gradient overlay (kisses the edges with neon color) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(180deg, hsl(${a.glow} / 0.25) 0%, transparent 25%, transparent 60%, hsl(220 60% 5% / 0.85) 100%)`,
          }}
        />

        {/* Edge-only accent neon sheen (sides) */}
        <div
          className="absolute inset-y-0 left-0 w-[3px] pointer-events-none"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 14px hsl(${a.glow}), 0 0 28px hsl(${a.glow} / 0.7)`,
          }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[3px] pointer-events-none"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 14px hsl(${a.glow}), 0 0 28px hsl(${a.glow} / 0.7)`,
          }}
        />

        {/* Top dark bar to anchor the title */}
        <div
          className="absolute inset-x-0 top-0 h-[28%] pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(220 60% 5% / 0.55) 0%, transparent 100%)",
          }}
        />

        {/* Coming Soon ribbon */}
        {comingSoon && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
            <div
              className="px-2.5 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm"
              style={{
                background: "hsl(220 30% 8% / 0.9)",
                color: "hsl(var(--foreground) / 0.9)",
                border: "1px solid hsl(var(--foreground) / 0.25)",
              }}
            >
              Locked
            </div>
          </div>
        )}

        {/* Title — upper third */}
        <div className="absolute inset-x-0 top-[14%] md:top-[16%] z-10 px-3 text-center">
          <h3
            className="font-extrabold uppercase tracking-[0.06em] leading-[1.05]"
            style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.45rem)",
              color: `hsl(${a.text})`,
              textShadow: `0 0 12px hsl(${a.glow}), 0 0 24px hsl(${a.glow} / 0.7), 0 2px 6px hsl(220 60% 5% / 0.9)`,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Description — lower third */}
        <div className="absolute inset-x-0 bottom-5 md:bottom-7 z-10 px-3 md:px-4 text-center">
          <p
            className="text-[10px] md:text-[11.5px] leading-snug font-medium"
            style={{
              color: "hsl(0 0% 100% / 0.92)",
              textShadow: "0 1px 6px hsl(220 60% 5% / 0.95), 0 0 12px hsl(220 60% 5% / 0.85)",
            }}
          >
            {description}
          </p>
        </div>
      </div>
    </motion.button>
  );
};

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
    playAmbassadorSelect,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6 overflow-y-auto"
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
              backgroundColor: "rgba(5, 10, 25, 0.65)",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-[102] w-full max-w-[1320px] py-4 max-h-[95vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Close button */}
            <motion.button
              className="absolute -top-1 right-2 md:right-4 p-2.5 rounded-full bg-secondary/60 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/40 transition-colors duration-150 z-[103]"
              onClick={handleClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </motion.button>

            {/* Header — top-left, like reference */}
            <div className="mb-5 md:mb-7 px-2 md:px-4">
              <motion.h2
                className="text-2xl md:text-4xl font-extrabold uppercase tracking-[0.14em] text-foreground inline-block"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{
                  textShadow:
                    "0 0 14px hsl(var(--primary) / 0.5), 0 0 28px hsl(var(--primary) / 0.25)",
                }}
              >
                Choose Your Path
              </motion.h2>
              <motion.div
                className="mt-2 h-[2px] w-full max-w-[260px] md:max-w-[360px] rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.55 }}
                style={{
                  background: "linear-gradient(90deg, hsl(var(--primary)), transparent)",
                  boxShadow: "0 0 10px hsl(var(--primary) / 0.7)",
                }}
              />
            </div>

            {/* Panels row — edge-to-edge, no gaps (reference style) */}
            <div className="px-2 md:px-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0 h-[420px] md:h-[520px] lg:h-[560px]">
                <RolePanel
                  title="Pathfinder"
                  description="Seek uncharted lands and lead the way. Unlock new territories."
                  image={pathfinderBg}
                  accent="violet"
                  delay={0.1}
                  onHover={playHover}
                  onClick={() => {
                    playPathfinderSelect();
                    onSelectMembers();
                  }}
                />
                <RolePanel
                  title="Opportunist"
                  description="Maximize gains and discover hidden treasure. Find the edge."
                  image={operatorBg}
                  accent="magenta"
                  delay={0.15}
                  onHover={playHover}
                  onClick={() => {
                    playOperatorSelect();
                    onSelectOperators();
                  }}
                />
                <RolePanel
                  title="Partner / Sponsor"
                  description="Build powerful alliances and provide key support. Accelerate growth."
                  image={partnerBg}
                  accent="gold"
                  delay={0.2}
                  onHover={playHover}
                  onClick={() => {
                    playCountryUnionSelect();
                    onSelectPartner();
                  }}
                />
                <RolePanel
                  title="Intern"
                  description="Gain valuable experience and assist key projects. Learn the ropes."
                  image={internBg}
                  accent="emerald"
                  delay={0.25}
                  disabled
                  comingSoon
                  onHover={playInternSelect}
                />
                <RolePanel
                  title="Ambassador"
                  description="Represent the interests of your faction. Foster diplomacy and influence."
                  image={collaboratorBg}
                  accent="cyan"
                  delay={0.3}
                  onHover={playHover}
                  onClick={() => {
                    playAmbassadorSelect();
                    onSelectAmbassador();
                  }}
                />
              </div>
            </div>

            {/* Footer hint */}
            <motion.div
              className="mt-5 md:mt-7 flex items-center justify-end gap-4 px-2 md:px-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]"
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
