import { memo } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

// Memoized to prevent unnecessary re-renders
const GlassCard = memo(({ 
  children, 
  className, 
  hover = false, 
  glow = false,
  ...props 
}: GlassCardProps) => {
  return (
    <motion.div
      className={cn(
        hover ? "glass-card-hover" : "glass-card",
        glow && "glow-border",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

GlassCard.displayName = 'GlassCard';

export default GlassCard;
