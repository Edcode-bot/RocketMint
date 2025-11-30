import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
}

interface SmokeTrailProps {
  isActive: boolean;
  isLaunching: boolean;
}

export function SmokeTrail({ isActive, isLaunching }: SmokeTrailProps) {
  const [particles, setParticles] = useState<SmokeParticle[]>([]);

  useEffect(() => {
    if (isActive || isLaunching) {
      const newParticles: SmokeParticle[] = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 40 - 20,
        y: Math.random() * 30,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.6 + 0.2,
        delay: Math.random() * 0.5,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isActive, isLaunching]);

  if (!isActive && !isLaunching) return null;

  return (
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 pointer-events-none" data-testid="smoke-trail">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            "absolute rounded-full animate-smoke-rise",
            isLaunching ? "bg-gradient-to-t from-gray-400/60 to-white/30" : "bg-gradient-to-t from-gray-500/40 to-gray-300/20"
          )}
          style={{
            left: `${particle.x}px`,
            bottom: `${particle.y}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animationDelay: `${particle.delay}s`,
            filter: "blur(4px)",
          }}
        />
      ))}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-8 bg-gradient-to-t from-gray-600/50 to-transparent rounded-full blur-lg animate-smoke-expand" />
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-gradient-to-t from-gray-500/30 to-transparent rounded-full blur-xl animate-smoke-expand" style={{ animationDelay: "0.1s" }} />
    </div>
  );
}
