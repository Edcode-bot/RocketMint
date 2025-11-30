import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ShootingStar {
  id: number;
  startX: number;
  startY: number;
  angle: number;
  length: number;
  duration: number;
  delay: number;
}

export function AnimatedBackground() {
  const stars = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.6 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 5,
    })),
  []);

  const shootingStars = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => ({
      id: i,
      startX: Math.random() * 80,
      startY: Math.random() * 30,
      angle: Math.random() * 30 + 30,
      length: Math.random() * 80 + 40,
      duration: Math.random() * 1 + 0.5,
      delay: Math.random() * 10 + i * 8,
    })),
  []);

  const nebulaClouds = useMemo(() => [
    { x: 10, y: 20, size: 200, color: "rgba(53, 208, 127, 0.08)", blur: 60 },
    { x: 70, y: 60, size: 180, color: "rgba(252, 186, 3, 0.06)", blur: 50 },
    { x: 40, y: 80, size: 220, color: "rgba(147, 51, 234, 0.05)", blur: 70 },
  ], []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" data-testid="animated-background">
      <div className="absolute inset-0 bg-gradient-to-b from-space-darker via-space-dark to-space-purple/30" />
      
      {nebulaClouds.map((cloud, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-nebula-drift"
          style={{
            left: `${cloud.x}%`,
            top: `${cloud.y}%`,
            width: `${cloud.size}px`,
            height: `${cloud.size}px`,
            background: cloud.color,
            filter: `blur(${cloud.blur}px)`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {shootingStars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-shooting-star"
          style={{
            left: `${star.startX}%`,
            top: `${star.startY}%`,
            width: `${star.length}px`,
            height: "2px",
            background: "linear-gradient(90deg, transparent, white, transparent)",
            transform: `rotate(${star.angle}deg)`,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-space-dark/80 via-transparent to-transparent" />
    </div>
  );
}
