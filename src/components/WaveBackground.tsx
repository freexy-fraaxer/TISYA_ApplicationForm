import { motion } from "framer-motion";

const WaveBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Deep navy gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(220,50%,8%)] via-[hsl(220,55%,12%)] to-[hsl(220,60%,6%)]" />
      
      {/* Animated waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave 1 - Slowest, most opaque */}
        <motion.div
          className="absolute w-[200%] h-[120px] bottom-0 left-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsl(210 80% 40% / 0.08) 100%)",
            borderRadius: "100% 100% 0 0",
          }}
          animate={{
            x: ["-50%", "0%", "-50%"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Wave 2 */}
        <motion.div
          className="absolute w-[200%] h-[100px] bottom-0 left-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsl(210 70% 45% / 0.06) 100%)",
            borderRadius: "100% 100% 0 0",
          }}
          animate={{
            x: ["0%", "-50%", "0%"],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Wave 3 - Fastest */}
        <motion.div
          className="absolute w-[200%] h-[80px] bottom-0 left-0"
          style={{
            background: "linear-gradient(180deg, transparent 0%, hsl(200 80% 50% / 0.04) 100%)",
            borderRadius: "100% 100% 0 0",
          }}
          animate={{
            x: ["-25%", "-75%", "-25%"],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Upper wave accent */}
        <motion.div
          className="absolute w-[300%] h-[200px] top-1/4"
          style={{
            background: "linear-gradient(180deg, hsl(210 60% 30% / 0.03) 0%, transparent 100%)",
            borderRadius: "50%",
            transform: "rotate(-3deg)",
          }}
          animate={{
            x: ["0%", "-33%", "0%"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Subtle glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.08]"
        style={{
          background: "radial-gradient(circle, hsl(210 100% 50%) 0%, transparent 70%)",
          top: "-10%",
          right: "-5%",
          filter: "blur(60px)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.08, 0.12, 0.08],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle, hsl(200 90% 45%) 0%, transparent 70%)",
          bottom: "10%",
          left: "-5%",
          filter: "blur(50px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.1, 0.06],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};

export default WaveBackground;
