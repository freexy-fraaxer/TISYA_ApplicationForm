import { motion } from "framer-motion";
import GlassCard from "../GlassCard";
import HeroButton from "../HeroButton";
import { CheckCircle, ArrowRight } from "lucide-react";
import tisyaLogo from "@/assets/tisya-logo.png";

interface SuccessScreenProps {
  applicationId: string;
  onBack: () => void;
}

const SuccessScreen = ({ applicationId, onBack }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <GlassCard
        className="max-w-lg w-full p-8 md:p-12 text-center"
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
          alt="TİSYA Logo"
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
          Application Submitted! 🎉
        </motion.h2>

        <motion.p
          className="text-muted-foreground mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Welcome to the Alliance, Operator. We'll be in touch soon.
        </motion.p>

        {/* Application ID */}
        <motion.div
          className="glass-card p-4 mb-8"
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

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <HeroButton onClick={onBack} variant="secondary">
            Back to Home
            <ArrowRight className="w-4 h-4" />
          </HeroButton>
        </motion.div>
      </GlassCard>
    </div>
  );
};

export default SuccessScreen;
