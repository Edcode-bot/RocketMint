
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface RocketSVGProps {
  isLaunching: boolean;
  isShaking: boolean;
  targetPlanetId?: number;
}

export function RocketSVG({ isLaunching, isShaking, targetPlanetId }: RocketSVGProps) {
  const [isFlying, setIsFlying] = useState(false);
  const [hasLanded, setHasLanded] = useState(false);

  useEffect(() => {
    if (isLaunching) {
      setIsFlying(true);
      setHasLanded(false);
      
      // After 2s of flight, mark as landed
      const timer = setTimeout(() => {
        setIsFlying(false);
        setHasLanded(true);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setIsFlying(false);
      setHasLanded(false);
    }
  }, [isLaunching]);

  return (
    <div className={cn(
      "relative transition-all duration-1000",
      isShaking && "animate-shake",
      isFlying && "-translate-y-96 opacity-0",
      hasLanded && "translate-y-0 opacity-100"
    )}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 64 64" 
        className="w-20 h-20 md:w-24 md:h-24"
      >
        <defs>
          <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#35D07F", stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: "#2BA968", stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Rocket body */}
        <path d="M32 8 L24 40 L32 48 L40 40 Z" fill="url(#rocketGradient)"/>
        
        {/* Rocket window */}
        <circle cx="32" cy="24" r="4" fill="#fff" opacity="0.9"/>
        
        {/* Rocket fins */}
        <path d="M24 36 L18 48 L24 44 Z" fill="#2BA968"/>
        <path d="M40 36 L46 48 L40 44 Z" fill="#2BA968"/>
        
        {/* Flame (only when launching or shaking) */}
        {(isLaunching || isShaking) && (
          <>
            <path d="M28 48 L32 58 L36 48" fill="#FF6B35" opacity="0.8"/>
            <path d="M30 48 L32 56 L34 48" fill="#FFA500" opacity="0.9"/>
          </>
        )}
      </svg>
    </div>
  );
}
