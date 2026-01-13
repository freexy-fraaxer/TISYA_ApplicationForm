import { motion } from "framer-motion";

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep navy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,6%)] via-[hsl(220,55%,10%)] to-[hsl(220,60%,4%)]" />
      
      {/* Animated flowing waves */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
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

        {/* Wave 1 - Slow, bottom */}
        <motion.path
          d="M0,700 C360,650 720,750 1080,700 C1260,675 1440,725 1440,725 L1440,800 L0,800 Z"
          fill="url(#waveGradient1)"
          animate={{
            d: [
              "M0,700 C360,650 720,750 1080,700 C1260,675 1440,725 1440,725 L1440,800 L0,800 Z",
              "M0,720 C360,770 720,670 1080,720 C1260,745 1440,695 1440,695 L1440,800 L0,800 Z",
              "M0,700 C360,650 720,750 1080,700 C1260,675 1440,725 1440,725 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 2 - Medium speed, middle-bottom */}
        <motion.path
          d="M0,650 C240,700 480,600 720,650 C960,700 1200,600 1440,650 L1440,800 L0,800 Z"
          fill="url(#waveGradient2)"
          animate={{
            d: [
              "M0,650 C240,700 480,600 720,650 C960,700 1200,600 1440,650 L1440,800 L0,800 Z",
              "M0,670 C240,620 480,720 720,670 C960,620 1200,720 1440,670 L1440,800 L0,800 Z",
              "M0,650 C240,700 480,600 720,650 C960,700 1200,600 1440,650 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Wave 3 - Faster, middle */}
        <motion.path
          d="M0,550 C180,580 360,520 540,550 C720,580 900,520 1080,550 C1260,580 1440,520 1440,520 L1440,800 L0,800 Z"
          fill="url(#waveGradient3)"
          animate={{
            d: [
              "M0,550 C180,580 360,520 540,550 C720,580 900,520 1080,550 C1260,580 1440,520 1440,520 L1440,800 L0,800 Z",
              "M0,530 C180,500 360,560 540,530 C720,500 900,560 1080,530 C1260,500 1440,560 1440,560 L1440,800 L0,800 Z",
              "M0,550 C180,580 360,520 540,550 C720,580 900,520 1080,550 C1260,580 1440,520 1440,520 L1440,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Upper flowing curve */}
        <motion.path
          d="M-100,300 Q360,250 720,300 T1540,300"
          fill="none"
          stroke="url(#waveGradient1)"
          strokeWidth="2"
          strokeOpacity="0.3"
          animate={{
            d: [
              "M-100,300 Q360,250 720,300 T1540,300",
              "M-100,320 Q360,370 720,320 T1540,320",
              "M-100,300 Q360,250 720,300 T1540,300",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Mid flowing curve */}
        <motion.path
          d="M-100,450 Q400,400 800,450 T1540,450"
          fill="none"
          stroke="url(#waveGradient2)"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          animate={{
            d: [
              "M-100,450 Q400,400 800,450 T1540,450",
              "M-100,430 Q400,480 800,430 T1540,430",
              "M-100,450 Q400,400 800,450 T1540,450",
            ],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Top accent curve */}
        <motion.path
          d="M-100,150 Q300,120 600,150 T1200,150 T1540,130"
          fill="none"
          stroke="url(#waveGradient3)"
          strokeWidth="1"
          strokeOpacity="0.2"
          animate={{
            d: [
              "M-100,150 Q300,120 600,150 T1200,150 T1540,130",
              "M-100,170 Q300,200 600,170 T1200,170 T1540,190",
              "M-100,150 Q300,120 600,150 T1200,150 T1540,130",
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Subtle glow orbs */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(210 100% 50% / 0.06) 0%, transparent 70%)",
          top: "-15%",
          right: "-10%",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(200 90% 45% / 0.05) 0%, transparent 70%)",
          bottom: "5%",
          left: "-8%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default WaveBackground;
