import { memo, useEffect, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

// Memoized to prevent re-renders when parent state changes
const WaveBackground = memo(() => {
  const isMobile = useIsMobile();
  const [isReduced, setIsReduced] = useState(false);

  // Check for reduced motion preference and high refresh rate monitors
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReduced(prefersReducedMotion);
  }, []);
  
  return (
    <div 
      className="fixed inset-0 overflow-hidden pointer-events-none z-0"
      style={{ 
        containIntrinsicSize: '100vw 100vh',
        contain: 'strict',
        willChange: 'auto'
      }}
    >
      {/* Deep navy gradient background - static, no animation */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,6%)] via-[hsl(220,55%,10%)] to-[hsl(220,60%,4%)]" />
      
      {/* Animated flowing waves - CSS only, GPU-accelerated, contained repaint */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        style={{ 
          contain: 'layout paint',
          willChange: isMobile || isReduced ? 'auto' : 'transform'
        }}
      >
        <defs>
          <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(210, 80%, 40%)" stopOpacity="0.08" />
            <stop offset="50%" stopColor="hsl(200, 90%, 45%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(210, 80%, 40%)" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(200, 70%, 50%)" stopOpacity="0.06" />
            <stop offset="50%" stopColor="hsl(210, 80%, 55%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(200, 70%, 50%)" stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(215, 60%, 45%)" stopOpacity="0.05" />
            <stop offset="50%" stopColor="hsl(205, 75%, 50%)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(215, 60%, 45%)" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Static waves on mobile/reduced motion, CSS animated on desktop */}
        {!isMobile && !isReduced ? (
          <>
            {/* Wave layers using CSS animations with transform only - contained */}
            <g className="wave-layer wave-layer-slow">
              <path
                d="M0,700 C360,650 720,750 1080,700 C1260,675 1440,725 1440,725 L1440,800 L0,800 Z"
                fill="url(#waveGradient1)"
              />
            </g>
            <g className="wave-layer wave-layer-medium">
              <path
                d="M0,650 C240,700 480,600 720,650 C960,700 1200,600 1440,650 L1440,800 L0,800 Z"
                fill="url(#waveGradient2)"
              />
            </g>
            <g className="wave-layer wave-layer-fast">
              <path
                d="M0,550 C180,580 360,520 540,550 C720,580 900,520 1080,550 C1260,580 1440,520 1440,520 L1440,800 L0,800 Z"
                fill="url(#waveGradient3)"
              />
            </g>
            {/* Subtle line strokes */}
            <path
              className="wave-line wave-line-slow"
              d="M-100,300 Q360,250 720,300 T1540,300"
              fill="none"
              stroke="url(#waveGradient1)"
              strokeWidth="2"
              strokeOpacity="0.3"
            />
            <path
              className="wave-line wave-line-medium"
              d="M-100,450 Q400,400 800,450 T1540,450"
              fill="none"
              stroke="url(#waveGradient2)"
              strokeWidth="1.5"
              strokeOpacity="0.25"
            />
          </>
        ) : (
          /* Static waves on mobile - no animation for performance */
          <>
            <path
              d="M0,700 C360,650 720,750 1080,700 C1260,675 1440,725 1440,725 L1440,800 L0,800 Z"
              fill="url(#waveGradient1)"
            />
            <path
              d="M0,650 C240,700 480,600 720,650 C960,700 1200,600 1440,650 L1440,800 L0,800 Z"
              fill="url(#waveGradient2)"
            />
            <path
              d="M0,550 C180,580 360,520 540,550 C720,580 900,520 1080,550 C1260,580 1440,520 1440,520 L1440,800 L0,800 Z"
              fill="url(#waveGradient3)"
            />
          </>
        )}
      </svg>

      {/* Subtle glow orbs - GPU layer, contained paint */}
      {!isMobile && !isReduced && (
        <>
          <div
            className="absolute w-[600px] h-[600px] rounded-full orb-pulse"
            style={{
              background: "radial-gradient(circle, hsl(210 100% 50% / 0.06) 0%, transparent 70%)",
              top: "-15%",
              right: "-10%",
              filter: "blur(80px)",
              contain: 'layout paint',
            }}
          />
          <div
            className="absolute w-[500px] h-[500px] rounded-full orb-pulse-slow"
            style={{
              background: "radial-gradient(circle, hsl(200 90% 45% / 0.05) 0%, transparent 70%)",
              bottom: "5%",
              left: "-8%",
              filter: "blur(60px)",
              contain: 'layout paint',
            }}
          />
        </>
      )}
    </div>
  );
});

WaveBackground.displayName = 'WaveBackground';

export default WaveBackground;