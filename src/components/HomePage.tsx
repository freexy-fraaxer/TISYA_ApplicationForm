import { motion } from "framer-motion";
import GlassCard from "./GlassCard";
import HeroButton from "./HeroButton";
import tisyaLogo from "@/assets/tisya-logo.svg";
import SocialLinks from "./shared/SocialLinks";

interface HomePageProps {
  onJoinClick: () => void;
}

const HomePage = ({ onJoinClick }: HomePageProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="max-w-lg w-full p-8 md:p-12 text-center"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Logo */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <img
            src={tisyaLogo}
            alt="TISYA Logo"
            className="h-20 md:h-28 w-auto mx-auto drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl font-bold text-foreground mb-4 glow-text md:text-2xl text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          WELCOME TO THE ALLIANCE
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-muted-foreground text-lg mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Pick your path. Build with TİSYA.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <HeroButton onClick={onJoinClick} size="lg">
            Join TİSYA
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
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Follow us</p>
          <SocialLinks />
        </motion.div>

        {/* Decorative elements */}
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
