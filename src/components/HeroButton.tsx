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
    primary: cn(
      "bg-primary text-primary-foreground",
      "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
      "hover:shadow-[0_0_30px_rgba(56,189,248,0.5)]",
      "border border-primary/50"
    ),
    secondary: cn(
      "bg-secondary text-secondary-foreground",
      "border border-border hover:border-primary/50",
      "hover:shadow-[0_0_20px_rgba(56,189,248,0.15)]"
    ),
    ghost: cn(
      "bg-transparent text-foreground",
      "hover:bg-secondary/50",
      "hover:text-primary"
    ),
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
      whileHover={{ 
        scale: disabled ? 1 : 1.03,
        y: disabled ? 0 : -2,
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Shimmer sweep for primary buttons */}
      {variant === "primary" && !disabled && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "200%" }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
          }}
          style={{ willChange: "transform" }}
        />
      )}

      {/* Hover overlay */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default HeroButton;
