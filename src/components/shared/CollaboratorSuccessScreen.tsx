import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import GlassCard from "../GlassCard";
import HeroButton from "../HeroButton";
import { CheckCircle, ArrowRight, Bell } from "lucide-react";
import tisyaLogo from "@/assets/tisya-logo.svg";
import { useSound } from "@/contexts/SoundContext";
import Confetti from "./Confetti";

interface CollaboratorSuccessScreenProps {
  applicationId: string;
  onBack: () => void;
}

const CollaboratorSuccessScreen = ({ applicationId, onBack }: CollaboratorSuccessScreenProps) => {
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
          className="text-2xl md:text-3xl font-bold text-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Request Received
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Thank you for your partnership inquiry. Our team will review your request and reach out to discuss potential collaboration opportunities.
        </motion.p>

        {/* Reference ID */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Reference ID
          </span>
          <p className="text-lg font-mono text-primary font-semibold">
            {applicationId}
          </p>
        </motion.div>

        {/* WhatsApp Channel Button */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <a
            href="https://whatsapp.com/channel/0029Vb6bEDeHltY0DZyezi0E"
            target="_blank"
            rel="noopener noreferrer"
          >
            <HeroButton size="lg" className="w-full">
              <Bell className="w-5 h-5" />
              Follow TISYA Updates
            </HeroButton>
          </a>
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

export default CollaboratorSuccessScreen;
