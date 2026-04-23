import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
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
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
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
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="max-w-lg w-full p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Logo */}
          <motion.div className="mb-10" variants={itemVariants}>
            <img
              src={tisyaLogo}
              alt="TISYA Logo"
              className="h-24 md:h-32 w-auto mx-auto drop-shadow-[0_0_25px_rgba(56,189,248,0.4)]"
            />
          </motion.div>

          {/* CTA Button */}
          <motion.div className="mb-10" variants={itemVariants}>
            <HeroButton onClick={handleJoinClick} size="lg">
              Join TISYA
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </HeroButton>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants}>
            <p className="text-sm text-muted-foreground mb-4">Follow us</p>
            <SocialLinks />
          </motion.div>
        </motion.div>

        {/* Decorative glow */}
        <motion.div
          className="absolute -bottom-2 -right-2 w-24 h-24 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </GlassCard>
    </div>
  );
};

export default HomePage;
