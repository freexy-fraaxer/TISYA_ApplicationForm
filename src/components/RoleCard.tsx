import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useT } from "@/contexts/LanguageContext";

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
  const isMobile = useIsMobile();
  const t = useT();

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden",
        "rounded-2xl border border-white/10",
        // Fixed heights - smaller on mobile for 2-column grid
        "h-[200px] md:h-[320px]",
        // Desktop-only hover effects via group
        !isMobile && "group",
        // Cursor styles
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        disabled && "grayscale-[60%] opacity-70",
        // Desktop-only CSS transitions for border/shadow
        !isMobile && !disabled && "transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-[0_0_50px_rgba(56,189,248,0.2)]",
      )}
      onClick={!disabled ? onClick : undefined}
      // Mobile: tap-only scale animation, no hover
      // Desktop: hover lift + subtle scale
      whileHover={!disabled && !isMobile ? { y: -4, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: isMobile ? 0.2 : 0.4,
        // Mobile: fast tap response
        scale: { duration: isMobile ? 0.1 : 0.2 }
      }}
    >
      {/* Diagonal Coming Soon Ribbon - top right corner */}
      {comingSoon && (
        <div className="absolute top-0 right-0 z-30 overflow-hidden w-24 h-24 md:w-28 md:h-28">
          <div className={cn(
            "absolute transform rotate-45",
            "top-[18px] -right-[28px] md:top-[22px] md:-right-[32px]",
            "w-[120px] md:w-[140px]",
            "bg-slate-600/90",
            // Desktop only: backdrop-blur
            !isMobile && "backdrop-blur-sm",
            "py-1 md:py-1.5",
            "text-center",
            "text-[8px] md:text-[9px] font-bold uppercase tracking-wider text-white/90",
            // Desktop only: shadow
            !isMobile && "shadow-lg"
          )}>
            {t.common.comingSoon}
          </div>
        </div>
      )}

      {/* Background Image Layer - static on mobile, animated on desktop */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <div
            className={cn(
              "w-full h-full bg-cover bg-center",
              // Desktop only: zoom transition on hover
              !isMobile && "transition-transform duration-500 ease-out group-hover:scale-105"
            )}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        </div>
      )}

      {/* Single dark gradient overlay for readability - simplified on mobile */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/75 to-background/50" />
      
      {/* Vignette effect - desktop only */}
      {!isMobile && (
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.5)_100%)]" />
      )}

      {/* Hover glow effect - desktop only */}
      {!isMobile && (
        <div
          className="absolute inset-0 z-[3] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 100%, hsl(var(--primary) / 0.2) 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Content - reduced padding on mobile */}
      <div className="relative z-10 h-full flex flex-col p-3 md:p-6">
        {/* Top section: Icon + Label */}
        <div className="flex items-start justify-between">
          {/* Icon with gradient glow - smaller on mobile, no animated effects on mobile */}
          <div 
            className={cn(
              "w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br from-primary/20 to-cyan-500/10",
              "border border-primary/30",
              // Desktop only: shadow and hover transitions
              !isMobile && "shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-[box-shadow,border-color,transform] duration-300",
              !isMobile && !disabled && "group-hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] group-hover:border-primary/50 group-hover:scale-105"
            )}
          >
            <div className={cn(
              "text-primary [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-6 md:[&>svg]:h-6",
              // Desktop only: drop-shadow
              !isMobile && "drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]"
            )}>
              {icon}
            </div>
          </div>

          {/* Role tag - smaller on mobile */}
          {label && (
            <span className={cn(
              "text-[8px] md:text-[10px] font-bold uppercase tracking-[0.1em] md:tracking-[0.15em] px-2 py-1 md:px-3 md:py-1.5 rounded-full",
              "bg-primary/10 border border-primary/20 text-primary",
              // Desktop only: backdrop-blur
              !isMobile && "backdrop-blur-sm"
            )}>
              {label}
            </span>
          )}
        </div>

        {/* Bottom section: Title, Description, Action */}
        <div className="mt-auto space-y-1 md:space-y-2">
          {/* Title - smaller on mobile, no color transition on mobile */}
          <h3 className={cn(
            "text-base md:text-2xl font-bold text-foreground",
            !isMobile && !disabled && "transition-colors duration-300 group-hover:text-primary"
          )}>
            {title}
          </h3>

          {/* Description - show 1 line on mobile */}
          <p className="text-xs md:text-sm text-muted-foreground/90 leading-snug md:leading-relaxed line-clamp-1 md:line-clamp-2">
            {description}
          </p>

          {/* Action hint - smaller on mobile, no hover transition on mobile */}
          {!disabled && (
            <div 
              className={cn(
                "flex items-center gap-1.5 md:gap-2 text-primary text-xs md:text-sm font-medium pt-1 md:pt-2",
                isMobile ? "opacity-70" : "opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              )}
            >
              <span>{t.common.start}</span>
              <ArrowRight className={cn(
                "w-3 h-3 md:w-4 md:h-4",
                !isMobile && "group-hover:translate-x-1 transition-transform duration-200"
              )} />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RoleCard;
