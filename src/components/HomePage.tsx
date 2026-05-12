import { motion } from "framer-motion";
import tisyaLogo from "@/assets/tisya-logo.svg";
import SocialLinks from "./shared/SocialLinks";
import { useSound } from "@/contexts/SoundContext";
import { useT } from "@/contexts/LanguageContext";

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
  const t = useT();

  const handleJoinClick = () => {
    enableSound();
    playClickJingle();
    onJoinClick();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative z-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-4 md:px-8 w-full max-w-5xl"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-6 md:mb-8">
          <img
            src={tisyaLogo}
            alt="TISYA Logo"
            className="h-16 md:h-24 w-auto mx-auto drop-shadow-[0_0_25px_hsl(var(--primary)/0.6)]"
          />
        </motion.div>

        {/* Massive italic neon headline — single line */}
        <motion.h1
          variants={itemVariants}
          className="font-extrabold italic tracking-tight leading-[0.95] select-none whitespace-nowrap"
          style={{
            fontSize: "clamp(1.75rem, 8.5vw, 7rem)",
            color: "hsl(190 100% 82%)",
            textShadow:
              "0 0 12px hsl(var(--primary) / 0.95), 0 0 28px hsl(var(--primary) / 0.7), 0 0 60px hsl(var(--primary) / 0.5), 0 0 110px hsl(var(--primary) / 0.35)",
            letterSpacing: "0.005em",
          }}
        >
          {t.home.headline}
        </motion.h1>

        {/* CTA Button — pill */}
        <motion.div variants={itemVariants} className="mt-10 md:mt-14">
          <motion.button
            onClick={handleJoinClick}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative overflow-hidden rounded-full px-10 md:px-16 py-3.5 md:py-4 text-base md:text-lg font-semibold tracking-[0.2em] uppercase"
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
            <span className="relative z-10">{t.home.cta}</span>
          </motion.button>
        </motion.div>

        {/* Follow us */}
        <motion.div variants={itemVariants} className="mt-10 md:mt-14">
          <p
            className="text-[10px] md:text-xs font-semibold tracking-[0.4em] uppercase mb-3"
            style={{ color: "hsl(var(--primary) / 0.85)" }}
          >
            {t.home.followUs}
          </p>
          <SocialLinks />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HomePage;
