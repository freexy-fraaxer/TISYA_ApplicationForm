import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ArrowRight } from "lucide-react";

interface RoleCardProps {
  title: string;
  label?: string;
  description: string;
  icon: React.ReactNode;
  backgroundImage?: string;
  disabled?: boolean;
  comingSoon?: boolean;
  onClick?: () => void;
}

const RoleCard = ({
  title,
  label,
  description,
  icon,
  backgroundImage,
  disabled = false,
  comingSoon = false,
  onClick,
}: RoleCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer overflow-hidden",
        "rounded-2xl border border-white/10",
        "h-[280px] md:h-[320px]",
        "transition-all duration-500",
        !disabled && "hover:border-primary/50 hover:shadow-[0_0_50px_rgba(56,189,248,0.2)]",
        disabled && "cursor-not-allowed grayscale-[60%] opacity-70",
      )}
      onClick={!disabled ? onClick : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={!disabled ? { y: -8, scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Coming Soon Ribbon - wrapped around top edge */}
      {comingSoon && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-30">
          <div className="relative">
            <div className="bg-primary px-6 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-lg rounded-b-lg">
              Coming Soon
            </div>
            {/* Ribbon sides */}
            <div className="absolute -left-2 top-0 w-2 h-full bg-primary/70 -skew-x-12 rounded-bl-sm" />
            <div className="absolute -right-2 top-0 w-2 h-full bg-primary/70 skew-x-12 rounded-br-sm" />
          </div>
        </div>
      )}

      {/* Background Image Layer */}
      {backgroundImage && (
        <motion.div
          className="absolute inset-0 z-0"
          animate={{
            scale: isHovered && !disabled ? 1.1 : 1,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/80 to-background/40" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.6)_100%)]" />

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.25) 0%, transparent 60%)`,
          opacity: isHovered && !disabled ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col p-5 md:p-6">
        {/* Top section: Icon + Label */}
        <div className="flex items-start justify-between">
          {/* Icon with gradient glow */}
          <motion.div 
            className={cn(
              "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-cyan-500/10",
              "border border-primary/30",
              "shadow-[0_0_20px_rgba(56,189,248,0.2)]",
              "transition-all duration-300",
              !disabled && "group-hover:shadow-[0_0_30px_rgba(56,189,248,0.4)] group-hover:border-primary/50"
            )}
            animate={{
              scale: isHovered && !disabled ? 1.1 : 1,
              rotate: isHovered && !disabled ? 5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-primary drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]">
              {icon}
            </div>
          </motion.div>

          {/* Role tag */}
          {label && (
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full",
              "bg-primary/10 border border-primary/20 text-primary",
              "backdrop-blur-sm"
            )}>
              {label}
            </span>
          )}
        </div>

        {/* Bottom section: Title, Description, Action */}
        <div className="mt-auto space-y-2">
          {/* Title */}
          <h3 className={cn(
            "text-xl md:text-2xl font-bold text-foreground transition-colors duration-300",
            !disabled && "group-hover:text-primary"
          )}>
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground/90 leading-relaxed line-clamp-2">
            {description}
          </p>

          {/* Action hint */}
          {!disabled && (
            <motion.div 
              className="flex items-center gap-2 text-primary text-sm font-medium pt-2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: isHovered ? 1 : 0.6, 
                x: isHovered ? 0 : -5 
              }}
              transition={{ duration: 0.3 }}
            >
              <span>Start</span>
              <motion.div
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;
