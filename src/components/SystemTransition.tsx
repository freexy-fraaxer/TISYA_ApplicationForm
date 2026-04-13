import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface SystemTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

const LINES = [
  "Initializing Alliance Interface…",
  "Scanning Available Roles…",
  "Paths Unlocked.",
];

const SystemTransition = ({ isActive, onComplete }: SystemTransitionProps) => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setVisibleLines(0);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 400 + i * 500));
    });
    timers.push(setTimeout(onComplete, 400 + LINES.length * 500 + 300));

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          className="fixed inset-0 z-[150] flex flex-col items-center justify-center gap-3"
          style={{
            background: "linear-gradient(135deg, hsl(220 40% 4%) 0%, hsl(220 45% 8%) 50%, hsl(215 50% 6%) 100%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Radial glow */}
          <div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(210 100% 50% / 0.08) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-3">
            {LINES.map((line, i) => (
              <AnimatePresence key={i}>
                {visibleLines > i && (
                  <motion.p
                    className={`text-sm md:text-base font-mono tracking-wide ${
                      i === LINES.length - 1
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {line}
                  </motion.p>
                )}
              </AnimatePresence>
            ))}

            {/* Loading dots */}
            {visibleLines < LINES.length && (
              <motion.div
                className="flex gap-1 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: dot * 0.2,
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SystemTransition;
