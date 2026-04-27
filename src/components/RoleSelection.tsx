import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSound } from "@/contexts/SoundContext";
import { useIsMobile } from "@/hooks/use-mobile";

import pathfinderBg from "@/assets/role-pathfinder-v3.png";
import operatorBg from "@/assets/role-operator-v3.png";
import partnerBg from "@/assets/role-partner-v3.png";
import internBg from "@/assets/role-intern-v3.png";
import ambassadorBg from "@/assets/role-ambassador-v3.png";

interface RoleSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOperators: () => void;
  onSelectMembers: () => void;
  onSelectAmbassador: () => void;
  onSelectCountryUnion: () => void; // kept for back-compat
  onSelectPartner: () => void;
}

interface Role {
  key: string;
  title: string;
  description: string;
  image: string;
  disabled?: boolean;
  onClick?: () => void;
  hoverSound?: () => void;
}

interface PanelProps {
  role: Role;
  index: number;
  total: number;
}

const SLANT = 30;

const RolePanel = ({ role, index, total }: PanelProps) => {
  const isMobile = useIsMobile();
  const { title, description, image, disabled, onClick, hoverSound } = role;

  const zIndex = total - index;
  const clipPath =
    index === 0
      ? `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, 0 100%)`
      : index === total - 1
        ? `polygon(0 0, 100% 0, 100% 100%, ${SLANT}px 100%)`
        : `polygon(0 0, calc(100% - ${SLANT}px) 0, 100% 100%, ${SLANT}px 100%)`;

  return (
    <motion.button
      type="button"
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={!disabled ? hoverSound : undefined}
      disabled={disabled}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: 0.08 + index * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      whileHover={!disabled && !isMobile ? { y: -6 } : undefined}
      whileTap={!disabled ? { scale: 0.99 } : undefined}
      className={cn(
        "group relative block h-full w-[calc(100%+30px)] text-left focus:outline-none overflow-hidden",
        index !== 0 && "-ml-[30px]",
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      )}
      style={{
        zIndex,
        clipPath,
        // Metallic edge frame between cards
        boxShadow:
          "inset 1px 0 0 hsl(0 0% 100% / 0.18), inset -1px 0 0 hsl(0 0% 100% / 0.18)",
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Background image */}
        <div
          className={cn(
            "absolute inset-0 bg-center bg-cover transition-transform duration-700",
            !disabled && "group-hover:scale-[1.06]",
            disabled && "grayscale opacity-60"
          )}
          style={{ backgroundImage: `url(${image})` }}
        />

        {/* Gradient for legibility (top + bottom) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, hsl(220 60% 3% / 0.78) 0%, hsl(220 60% 3% / 0.15) 28%, hsl(220 60% 3% / 0.15) 55%, hsl(220 60% 3% / 0.92) 100%)",
          }}
        />

        {/* Hover sheen */}
        {!disabled && (
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--primary) / 0.22) 0%, transparent 35%, transparent 65%, hsl(var(--primary) / 0.18) 100%)",
            }}
          />
        )}
      </div>

      <div className="absolute inset-0 flex flex-col justify-between">
        {/* Title — top */}
        <div
          className="pt-20 md:pt-24 text-center"
          style={{
            paddingLeft: "14px",
            paddingRight: index === total - 1 ? "14px" : `${SLANT + 14}px`,
          }}
        >
          <h3
            className="font-extrabold uppercase tracking-[0.08em] leading-[1.05] text-foreground"
            style={{
              fontSize: "clamp(0.95rem, 1.5vw, 1.7rem)",
              textShadow:
                "0 0 14px hsl(var(--primary) / 0.7), 0 2px 10px hsl(220 60% 3% / 0.95)",
            }}
          >
            {title}
          </h3>
          <div
            className="mx-auto mt-2 h-[2px] w-12 md:w-16 rounded-full opacity-80"
            style={{
              background:
                "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
              boxShadow: "0 0 8px hsl(var(--primary) / 0.7)",
            }}
          />
        </div>

        {/* Locked ribbon */}
        {disabled && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30">
            <div
              className="px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em] rounded-sm backdrop-blur-md"
              style={{
                background: "hsl(220 30% 6% / 0.8)",
                color: "hsl(var(--foreground) / 0.95)",
                border: "1px solid hsl(var(--foreground) / 0.35)",
              }}
            >
              Locked
            </div>
          </div>
        )}

        {/* Description — bottom */}
        <div
          className="pb-7 md:pb-10 text-center"
          style={{
            paddingLeft: index === 0 ? "16px" : `${SLANT + 16}px`,
            paddingRight: "16px",
          }}
        >
          <p
            className="text-[11px] md:text-[13px] leading-snug font-medium"
            style={{
              color: "hsl(0 0% 100% / 0.96)",
              textShadow:
                "0 1px 6px hsl(220 60% 3% / 0.98), 0 0 14px hsl(220 60% 3% / 0.9)",
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

  // Suppress unused
  void onSelectAmbassador;

  const roles: Role[] = [
    {
      key: "pathfinder",
      title: "Pathfinder",
      description: "Discover opportunities and navigate the TISYA network.",
      image: pathfinderBg,
      onClick: () => {
        playPathfinderSelect();
        onSelectMembers();
      },
      hoverSound: playHover,
    },
    {
      key: "opportunist",
      title: "Opportunist",
      description: "Create, manage, and bring ideas to life as an operator.",
      image: operatorBg,
      onClick: () => {
        playOperatorSelect();
        onSelectOperators();
      },
      hoverSound: playHover,
    },
    {
      key: "partner",
      title: "Partner / Sponsor",
      description: "Build powerful alliances and provide key support.",
      image: partnerBg,
      onClick: () => {
        playCountryUnionSelect();
        onSelectPartner();
      },
      hoverSound: playHover,
    },
    {
      key: "intern",
      title: "Intern",
      description: "Gain valuable experience and assist key projects.",
      image: internBg,
      disabled: true,
      hoverSound: playInternSelect,
    },
    {
      key: "ambassador",
      title: "Ambassador",
      description: "Represent TISYA across your campus or country.",
      image: ambassadorBg,
      disabled: true,
      hoverSound: playHover,
    },
  ];

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
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          >
            {/* Header bar (overlay style, doesn't steal panel height) */}
            <div className="absolute top-0 inset-x-0 z-[110] flex items-start justify-between px-4 md:px-8 pt-4 md:pt-6 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="pointer-events-auto"
              >
                <h2
                  className="text-lg md:text-2xl font-extrabold uppercase tracking-[0.18em] text-foreground"
                  style={{
                    textShadow:
                      "0 0 14px hsl(var(--primary) / 0.55), 0 2px 10px hsl(220 60% 3% / 0.9)",
                  }}
                >
                  Choose Your Path
                </h2>
                <motion.div
                  className="mt-2 h-[2px] w-[160px] md:w-[220px] rounded-full"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.25, duration: 0.55 }}
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(var(--primary)), transparent)",
                    boxShadow: "0 0 10px hsl(var(--primary) / 0.7)",
                  }}
                />
              </motion.div>

              <motion.button
                className="pointer-events-auto p-2.5 rounded-full bg-secondary/70 border border-white/10 text-foreground hover:bg-secondary hover:border-primary/40 transition-colors duration-150"
                onClick={handleClose}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Full-screen tilted slabs row */}
            <div className="relative flex-1 flex w-full h-full overflow-hidden">
              {roles.map((role, i) => (
                <div
                  key={role.key}
                  className="relative h-full"
                  style={{ flex: "1 1 0%", minWidth: 0 }}
                >
                  <RolePanel role={role} index={i} total={roles.length} />
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoleSelection;
