import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
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
  return (
    <motion.div
      className={cn(
        "relative group cursor-pointer overflow-hidden",
        "rounded-2xl border border-white/10",
        // Fixed heights - smaller on mobile for 2-column grid
        "h-[200px] md:h-[320px]",
        "transition-all duration-300",
        // Only apply hover effects on non-touch devices
        !disabled && "md:hover:border-primary/50 md:hover:shadow-[0_0_50px_rgba(56,189,248,0.2)]",
        disabled && "cursor-not-allowed grayscale-[60%] opacity-70",
      )}
      onClick={!disabled ? onClick : undefined}
      // Disable hover animations on mobile, only use tap
      whileHover={!disabled ? { y: -4, scale: 1.01 } : {}}
      whileTap={!disabled ? { scale: 0.97 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Diagonal Coming Soon Ribbon - top right corner */}
      {comingSoon && (
        <div className="absolute top-0 right-0 z-30 overflow-hidden w-24 h-24 md:w-28 md:h-28">
          <div className={cn(
            "absolute transform rotate-45",
            "top-[18px] -right-[28px] md:top-[22px] md:-right-[32px]",
            "w-[120px] md:w-[140px]",
            "bg-slate-600/90 backdrop-blur-sm",
            "py-1 md:py-1.5",
            "text-center",
            "text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/90",
            "shadow-lg"
          )}>
            Coming Soon
          </div>
        </div>
      )}

      {/* Background Image Layer - contained within bounds */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className={cn(
              "w-full h-full bg-cover bg-center",
              // Subtle zoom on hover for desktop only
              "md:transition-transform md:duration-500 md:ease-out",
              "md:group-hover:scale-105"
            )}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      )}

      {/* Dark gradient overlay for readability - 65% opacity */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/75 to-background/50" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.5)_100%)]" />

      {/* Hover glow effect - desktop only */}
      <div
        className={cn(
          "absolute inset-0 z-[3] pointer-events-none transition-opacity duration-500",
          "opacity-0 md:group-hover:opacity-100"
        )}
        style={{
          background: `radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.2) 0%, transparent 60%)`,
        }}
      />

      {/* Content - reduced padding on mobile */}
      <div className="relative z-10 h-full flex flex-col p-3 md:p-6">
        {/* Top section: Icon + Label */}
        <div className="flex items-start justify-between">
          {/* Icon with gradient glow - smaller on mobile */}
          <div 
            className={cn(
              "w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-cyan-500/10",
              "border border-primary/30",
              "shadow-[0_0_15px_rgba(56,189,248,0.2)]",
              "transition-all duration-300",
              !disabled && "md:group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] md:group-hover:border-primary/50 md:group-hover:scale-105"
            )}
          >
            <div className="text-primary drop-shadow-[0_0_6px_rgba(56,189,248,0.5)] [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6">
              {icon}
            </div>
          </div>

          {/* Role tag - smaller on mobile */}
          {label && (
            <span className={cn(
              "text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] px-2 py-1 md:px-3 md:py-1.5 rounded-full",
              "bg-primary/10 border border-primary/20 text-primary",
              "backdrop-blur-sm"
            )}>
              {label}
            </span>
          )}
        </div>

        {/* Bottom section: Title, Description, Action */}
        <div className="mt-auto space-y-1 md:space-y-2">
          {/* Title - smaller on mobile */}
          <h3 className={cn(
            "text-base md:text-2xl font-bold text-foreground transition-colors duration-300",
            !disabled && "md:group-hover:text-primary"
          )}>
            {title}
          </h3>

          {/* Description - hide on very small screens, show 1 line on mobile */}
          <p className="text-xs md:text-sm text-muted-foreground/90 leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-2">
            {description}
          </p>

          {/* Action hint - smaller on mobile */}
          {!disabled && (
            <div 
              className={cn(
                "flex items-center gap-1.5 md:gap-2 text-primary text-xs md:text-sm font-medium pt-1 md:pt-2",
                "opacity-70 md:opacity-60 md:group-hover:opacity-100",
                "transition-opacity duration-300"
              )}
            >
              <span>Start</span>
              <ArrowRight className="w-3 h-3 md:w-4 md:h-4 md:group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;
