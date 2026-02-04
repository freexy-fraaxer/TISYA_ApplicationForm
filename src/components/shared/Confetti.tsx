import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  size: number;
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(200, 100%, 60%)",
  "hsl(280, 80%, 65%)",
  "hsl(45, 100%, 60%)",
  "hsl(160, 80%, 55%)",
  "hsl(340, 85%, 65%)",
];

const Confetti = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // percentage across screen
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
      });
    }
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-sm"
          style={{
            left: `${particle.x}%`,
            top: -20,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
          initial={{ 
            y: -20, 
            rotate: 0, 
            opacity: 1,
            x: 0,
          }}
          animate={{ 
            y: "100vh", 
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: [1, 1, 0],
            x: (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
