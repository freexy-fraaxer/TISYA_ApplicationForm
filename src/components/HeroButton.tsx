import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HeroButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

const HeroButton = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = "primary",
  size = "lg",
}: HeroButtonProps) => {
  const baseStyles = "relative font-semibold rounded-xl transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-primary text-primary-foreground glow-button",
    secondary: "bg-secondary text-secondary-foreground border border-border hover:border-primary/50",
    ghost: "bg-transparent text-foreground hover:bg-secondary/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
    >
      {/* Ripple effect overlay */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
        animate={!disabled ? {
          translateX: ["100%", "-100%"],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3,
          ease: "easeInOut",
        }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default HeroButton;
