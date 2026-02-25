import { motion, AnimatePresence } from "framer-motion";
import tisyaLogo from "@/assets/tisya-logo.svg";

interface SplashScreenProps {
  isVisible: boolean;
}

const SplashScreen = ({ isVisible }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, hsl(220 40% 4%) 0%, hsl(220 45% 8%) 50%, hsl(215 50% 6%) 100%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Radial glow behind logo */}
          <motion.div
            className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(210 100% 50% / 0.12) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 0.8, 0.5] }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="flex flex-col items-center gap-6 relative z-10">
            {/* Logo with draw-in effect */}
            <motion.img
              src={tisyaLogo}
              alt="TISYA"
              className="h-16 md:h-24 w-auto"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Tagline with letter stagger */}
            <motion.div className="flex gap-[2px] overflow-hidden">
              {"THE ALLIANCE".split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="text-xs md:text-sm font-semibold tracking-[0.3em] text-primary/70"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.6 + i * 0.03,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.div>

            {/* Loading bar */}
            <motion.div
              className="w-32 md:w-48 h-[2px] rounded-full overflow-hidden bg-border/30 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, hsl(210 100% 60%), hsl(200 100% 50%))",
                  boxShadow: "0 0 10px hsl(210 100% 60% / 0.5)",
                }}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
