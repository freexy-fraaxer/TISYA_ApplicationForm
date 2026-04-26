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

type AccentKey = "cyan" | "violet" | "gold" | "emerald" | "magenta";

// Each accent expressed in HSL — neon glow + thin metallic frame
const ACCENTS: Record<
  AccentKey,
  { glow: string; border: string; tint: string; text: string }
> = {
  cyan: {
    glow: "199 100% 60%",
    border: "199 100% 70%",
    tint: "210 90% 30%",
    text: "195 100% 80%",
  },
  violet: {
    glow: "270 90% 65%",
    border: "270 95% 75%",
    tint: "265 70% 28%",
    text: "275 95% 85%",
  },
  gold: {
    glow: "42 95% 60%",
    border: "42 95% 70%",
    tint: "38 70% 28%",
    text: "45 100% 80%",
  },
  emerald: {
    glow: "150 80% 55%",
    border: "150 85% 65%",
    tint: "155 60% 22%",
    text: "150 90% 80%",
  },
  magenta: {
    glow: "320 85% 65%",
    border: "320 90% 75%",
    tint: "320 65% 30%",
    text: "320 95% 85%",
  },
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

  return (
    <motion.button
      type="button"
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={!disabled ? onHover : undefined}
      disabled={disabled}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={!disabled && !isMobile ? { y: -6, scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      className={cn(
        "group relative flex-1 min-w-0 text-left focus:outline-none",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={{ willChange: "transform" }}
    >
      {/* Outer neon glow halo */}
      <div
        className="absolute -inset-1 rounded-[22px] opacity-70 blur-md pointer-events-none transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(180deg, hsl(${a.glow} / 0.55), hsl(${a.glow} / 0.15))`,
        }}
      />

      {/* Card body — slim vertical panel */}
      <div
        className={cn(
          "relative rounded-[18px] overflow-hidden h-[360px] md:h-[460px] flex flex-col",
          disabled && "grayscale-[55%] opacity-80"
        )}
        style={{
          background: `linear-gradient(180deg, hsl(${a.tint} / 0.65) 0%, hsl(220 40% 7% / 0.92) 60%, hsl(220 50% 5% / 0.98) 100%)`,
          border: `1px solid hsl(${a.border} / 0.55)`,
          boxShadow: `inset 0 0 30px hsl(${a.glow} / 0.18), 0 0 24px hsl(${a.glow} / 0.35)`,
        }}
      >
        {/* Top metallic sheen */}
        <div
          className="absolute inset-x-0 top-0 h-1/3 pointer-events-none opacity-50"
          style={{
            background: `linear-gradient(180deg, hsl(${a.glow} / 0.35) 0%, transparent 100%)`,
          }}
        />

        {/* Edge neon strip — left */}
        <div
          className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full pointer-events-none"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 12px hsl(${a.glow} / 0.9), 0 0 24px hsl(${a.glow} / 0.6)`,
          }}
        />
        {/* Edge neon strip — right */}
        <div
          className="absolute right-0 top-4 bottom-4 w-[2px] rounded-full pointer-events-none"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 12px hsl(${a.glow} / 0.9), 0 0 24px hsl(${a.glow} / 0.6)`,
          }}
        />

        {/* Coming Soon ribbon */}
        {comingSoon && (
          <div className="absolute top-3 right-3 z-30">
            <div
              className="px-2 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-md"
              style={{
                background: "hsl(220 30% 15% / 0.85)",
                color: "hsl(var(--foreground) / 0.85)",
                border: "1px solid hsl(var(--foreground) / 0.2)",
              }}
            >
              Locked
            </div>
          </div>
        )}

        {/* Title */}
        <div className="relative z-10 pt-5 md:pt-7 px-3 md:px-4 text-center">
          <h3
            className="font-extrabold uppercase tracking-[0.08em] leading-tight"
            style={{
              fontSize: "clamp(0.95rem, 1.3vw, 1.35rem)",
              color: `hsl(${a.text})`,
              textShadow: `0 0 10px hsl(${a.glow} / 0.7), 0 0 20px hsl(${a.glow} / 0.4)`,
            }}
          >
            {title}
          </h3>
          {/* Underline accent */}
          <div
            className="mx-auto mt-2 h-[2px] w-10 rounded-full"
            style={{
              background: `hsl(${a.glow})`,
              boxShadow: `0 0 8px hsl(${a.glow} / 0.8)`,
            }}
          />
        </div>

        {/* Image — large central illustration */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-5 py-4 md:py-6">
          <div className="relative w-full h-full">
            <div
              className="absolute inset-0 rounded-xl bg-center bg-cover transition-transform duration-500 group-hover:scale-[1.04]"
              style={{
                backgroundImage: `url(${image})`,
                filter: `drop-shadow(0 0 14px hsl(${a.glow} / 0.5))`,
              }}
            />
            {/* Subtle inner vignette */}
            <div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 50%, hsl(220 50% 5% / 0.55) 100%)",
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="relative z-10 px-3 md:px-4 pb-4 md:pb-5 text-center">
          <p
            className="text-[10px] md:text-xs leading-snug"
            style={{ color: "hsl(var(--foreground) / 0.78)" }}
          >
            {description}
          </p>
        </div>

        {/* Bottom corner rivets */}
        <div
          className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 6px hsl(${a.glow})`,
          }}
        />
        <div
          className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full"
          style={{
            background: `hsl(${a.glow})`,
            boxShadow: `0 0 6px hsl(${a.glow})`,
          }}
        />
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
              backgroundColor: "rgba(5, 10, 25, 0.6)",
            }}
          />

          {/* Content */}
          <motion.div
            className="relative z-[102] w-full max-w-[1280px] py-4 max-h-[95vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
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

            {/* Header */}
            <div className="mb-6 md:mb-10 px-2 md:px-4">
              <motion.h2
                className="text-2xl md:text-4xl font-extrabold uppercase tracking-[0.12em] text-foreground"
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
              {/* Underline */}
              <motion.div
                className="mt-3 h-[2px] w-32 md:w-48 rounded-full"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.25, duration: 0.5 }}
                style={{
                  background:
                    "linear-gradient(90deg, hsl(var(--primary)), transparent)",
                  boxShadow: "0 0 10px hsl(var(--primary) / 0.7)",
                }}
              />
            </div>

            {/* Panels row — 2-col on small, 5-col on lg */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 px-2 md:px-4">
              <RolePanel
                title="Pathfinder"
                description="Discover opportunities and navigate the TISYA network."
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
                description="Create, manage, and bring ideas to life as an operator."
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
                description="Build powerful alliances and provide key support."
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
                description="Gain valuable experience and assist key projects."
                image={internBg}
                accent="emerald"
                delay={0.25}
                disabled
                comingSoon
                onHover={playInternSelect}
              />
              <RolePanel
                title="Ambassador"
                description="Represent TISYA across your campus or country."
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

            {/* Footer hint */}
            <motion.div
              className="mt-6 md:mt-8 flex items-center justify-end gap-4 px-2 md:px-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em]"
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
