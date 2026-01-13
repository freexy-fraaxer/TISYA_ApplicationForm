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
    
    const rotateXValue = ((y - centerY) / centerY) * -6;
    const rotateYValue = ((x - centerX) / centerX) * 6;
    
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
        "relative group cursor-pointer overflow-hidden",
        "rounded-2xl border border-white/10",
        "bg-gradient-to-b from-white/[0.08] to-white/[0.02]",
        "backdrop-blur-xl",
        "aspect-[3/4] min-h-[320px]",
        "transition-all duration-500",
        !disabled && "hover:border-primary/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.15)]",
        disabled && "cursor-not-allowed opacity-60 grayscale",
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={!disabled ? onClick : undefined}
      whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Coming Soon Ribbon - wrapped around top-right corner */}
      {comingSoon && (
        <div className="absolute -right-[35px] top-[25px] z-20 rotate-45">
          <div className="bg-primary px-10 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg">
            Coming Soon
          </div>
        </div>
      )}

      {/* Card animated background - flowing gradient */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <motion.div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 50% 120%, hsl(210 80% 40% / 0.15) 0%, transparent 60%),
              radial-gradient(ellipse 60% 40% at 50% -20%, hsl(200 90% 50% / 0.1) 0%, transparent 50%)
            `,
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Flowing wave inside card */}
        <svg
          className="absolute inset-0 w-full h-full opacity-30"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 200 300"
        >
          <defs>
            <linearGradient id={`cardWave-${title}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(200, 90%, 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(210, 80%, 50%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d="M0,250 Q50,230 100,250 T200,250 L200,300 L0,300 Z"
            fill={`url(#cardWave-${title})`}
            animate={{
              d: [
                "M0,250 Q50,230 100,250 T200,250 L200,300 L0,300 Z",
                "M0,260 Q50,280 100,260 T200,260 L200,300 L0,300 Z",
                "M0,250 Q50,230 100,250 T200,250 L200,300 L0,300 Z",
              ],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </svg>
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${50 + rotateY * 5}% ${50 + rotateX * 5}%, hsl(var(--primary) / 0.2) 0%, transparent 50%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-6">
        {/* Icon */}
        <motion.div 
          className="w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-auto group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <div className="text-primary text-2xl">
            {icon}
          </div>
        </motion.div>

        {/* Text Content - Bottom aligned */}
        <div className="mt-auto space-y-3">
          {/* Label */}
          {label && (
            <span className="inline-block text-[10px] font-semibold text-primary uppercase tracking-[0.2em] bg-primary/10 px-2 py-1 rounded">
              {label}
            </span>
          )}
          
          {/* Title */}
          <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>

          {/* Arrow indicator */}
          {!disabled && (
            <motion.div 
              className="flex items-center text-primary text-sm font-medium pt-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
              initial={{ x: 0 }}
              whileHover={{ x: 5 }}
            >
              <span>Get Started</span>
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;
