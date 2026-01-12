import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface RoleCardProps {
  title: string;
  label?: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}

const RoleCard = ({
  title,
  label,
  description,
  icon,
  disabled = false,
  comingSoon = false,
  onClick,
}: RoleCardProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -8;
    const rotateYValue = ((x - centerX) / centerX) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      className={cn(
        "role-card relative group",
        disabled && "disabled",
        comingSoon && "grayscale"
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Coming Soon Ribbon */}
      {comingSoon && (
        <div className="ribbon rounded-lg">Coming Soon</div>
      )}

      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + rotateY * 3}% ${50 + rotateX * 3}%, hsl(var(--primary) / 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
          <div className="text-primary text-2xl">
            {icon}
          </div>
        </div>

        {/* Title & Label */}
        <div className="mb-2">
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          {label && (
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        {/* Arrow indicator */}
        {!disabled && (
          <motion.div 
            className="mt-4 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
          >
            <span>Get Started</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default RoleCard;
