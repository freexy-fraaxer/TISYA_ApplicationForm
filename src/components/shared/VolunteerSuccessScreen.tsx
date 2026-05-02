import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import GlassCard from "../GlassCard";
import HeroButton from "../HeroButton";
import { CheckCircle, ArrowRight, Clock } from "lucide-react";
import tisyaLogo from "@/assets/tisya-logo.svg";
import SocialLinks from "./SocialLinks";
import { useSound } from "@/contexts/SoundContext";
import Confetti from "./Confetti";

interface VolunteerSuccessScreenProps {
  applicationId: string;
  onBack: () => void;
}

const VolunteerSuccessScreen = ({ applicationId, onBack }: VolunteerSuccessScreenProps) => {
  const { playCelebration, playBack } = useSound();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      playCelebration();
      setShowConfetti(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [playCelebration]);

  const handleBack = () => {
    playBack();
    onBack();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      {showConfetti && <Confetti />}
      
      <GlassCard
        className="max-w-lg w-full p-8 md:p-12 text-center max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Success Icon */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-primary/20 flex items-center justify-center pulse-glow">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
        </motion.div>

        {/* Logo */}
        <motion.img
          src={tisyaLogo}
          alt="TISYA Logo"
          className="h-12 w-auto mx-auto mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        />

        {/* Success Message */}
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Welcome to TISYA
        </motion.h2>

        <motion.p
          className="text-lg text-primary/80 font-medium mb-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          You are now part of The Alliance
        </motion.p>

        <motion.p
          className="text-xs text-muted-foreground/60 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Path: Opportunist
        </motion.p>

        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          Thank you for your interest in becoming an Opportunist. We appreciate your willingness to contribute to the Alliance.
        </motion.p>

        {/* Application ID */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Application ID
          </span>
          <p className="text-lg font-mono text-primary font-semibold">
            {applicationId}
          </p>
        </motion.div>

        {/* Review Timeline */}
        <motion.div
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-8 p-3 rounded-lg bg-secondary/30 border border-border/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <Clock className="w-4 h-4" />
          <span>We usually review applications within 3–5 working days.</span>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <p className="text-sm text-muted-foreground mb-4">Follow us on social media</p>
          <SocialLinks />
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <HeroButton onClick={handleBack} variant="secondary">
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </HeroButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default VolunteerSuccessScreen;
