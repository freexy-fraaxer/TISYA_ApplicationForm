import { motion } from "framer-motion";
import tisyaLogo from "@/assets/tisya-logo.svg";
import SocialLinks from "./shared/SocialLinks";
import { useSound } from "@/contexts/SoundContext";

interface HomePageProps {
  onJoinClick: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
};

const HomePage = ({ onJoinClick }: HomePageProps) => {
  const { enableSound, playClickJingle } = useSound();

  const handleJoinClick = () => {
    enableSound();
    playClickJingle();
    onJoinClick();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10">
      {/* Glowing neon frame container — game UI panel */}
      <motion.div
        className="relative w-full max-w-5xl"
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Outer neon glow */}
        <div
          className="absolute inset-0 rounded-[28px] pointer-events-none"
          style={{
            boxShadow:
              "0 0 60px hsl(var(--primary) / 0.35), 0 0 120px hsl(var(--primary) / 0.15)",
          }}
        />

        {/* Animated double border frame */}
        <div
          className="relative rounded-[28px] p-[1.5px]"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary) / 0.7), hsl(var(--primary) / 0.15) 40%, hsl(var(--primary) / 0.15) 60%, hsl(var(--primary) / 0.7))",
          }}
        >
          <div
            className="relative rounded-[26px] overflow-hidden"
            style={{
              background:
                "linear-gradient(180deg, hsl(220 40% 8% / 0.55) 0%, hsl(220 40% 6% / 0.35) 100%)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {/* Inner secondary frame line */}
            <div
              className="absolute inset-3 md:inset-4 rounded-[20px] pointer-events-none border"
              style={{
                borderColor: "hsl(var(--primary) / 0.35)",
                boxShadow:
                  "inset 0 0 30px hsl(var(--primary) / 0.15), 0 0 20px hsl(var(--primary) / 0.2)",
              }}
            />

            {/* Corner accents */}
            {[
              "top-2 left-2 border-l-2 border-t-2 rounded-tl-xl",
              "top-2 right-2 border-r-2 border-t-2 rounded-tr-xl",
              "bottom-2 left-2 border-l-2 border-b-2 rounded-bl-xl",
              "bottom-2 right-2 border-r-2 border-b-2 rounded-br-xl",
            ].map((cls, i) => (
              <div
                key={i}
                className={`absolute w-6 h-6 md:w-8 md:h-8 ${cls} pointer-events-none`}
                style={{
                  borderColor: "hsl(var(--primary))",
                  boxShadow: "0 0 10px hsl(var(--primary) / 0.7)",
                }}
              />
            ))}

            {/* Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 py-10 md:py-16"
            >
              {/* Logo */}
              <motion.div variants={itemVariants} className="mb-4 md:mb-6">
                <img
                  src={tisyaLogo}
                  alt="TISYA Logo"
                  className="h-16 md:h-24 w-auto mx-auto drop-shadow-[0_0_25px_hsl(var(--primary)/0.6)]"
                />
              </motion.div>

              {/* Massive neon "JOIN US" headline */}
              <motion.h1
                variants={itemVariants}
                className="font-extrabold tracking-tight leading-none select-none"
                style={{
                  fontSize: "clamp(3.5rem, 13vw, 9rem)",
                  color: "hsl(190 100% 80%)",
                  textShadow:
                    "0 0 12px hsl(var(--primary) / 0.95), 0 0 28px hsl(var(--primary) / 0.7), 0 0 60px hsl(var(--primary) / 0.5), 0 0 110px hsl(var(--primary) / 0.35)",
                  letterSpacing: "0.01em",
                }}
              >
                JOIN US
              </motion.h1>

              {/* CTA Button — pill */}
              <motion.div variants={itemVariants} className="mt-8 md:mt-10">
                <motion.button
                  onClick={handleJoinClick}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="relative overflow-hidden rounded-full px-12 md:px-16 py-3.5 md:py-4 text-base md:text-lg font-semibold tracking-[0.2em] uppercase"
                  style={{
                    color: "hsl(220 50% 12%)",
                    background:
                      "linear-gradient(180deg, hsl(195 95% 78%) 0%, hsl(205 95% 62%) 100%)",
                    boxShadow:
                      "0 0 30px hsl(var(--primary) / 0.7), 0 0 60px hsl(var(--primary) / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.5), inset 0 -2px 8px hsl(220 60% 30% / 0.3)",
                    border: "1px solid hsl(195 100% 85% / 0.6)",
                  }}
                >
                  {/* shimmer */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.35) 50%, transparent 100%)",
                    }}
                    initial={{ x: "-120%" }}
                    animate={{ x: "120%" }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      repeatDelay: 2.5,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative z-10">Join TISYA</span>
                </motion.button>
              </motion.div>

              {/* Follow us */}
              <motion.div variants={itemVariants} className="mt-8 md:mt-10">
                <p
                  className="text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase mb-3"
                  style={{ color: "hsl(var(--primary) / 0.85)" }}
                >
                  Follow Us
                </p>
                <SocialLinks />
              </motion.div>

              {/* Version tag — bottom-left */}
              <div
                className="absolute bottom-3 left-4 md:bottom-4 md:left-6 text-[10px] md:text-xs font-mono tracking-widest"
                style={{ color: "hsl(var(--primary) / 0.5)" }}
              >
                v.0102
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;
