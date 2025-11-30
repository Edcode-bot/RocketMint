import { useMemo } from "react";

interface Star {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

export function StarField({ count = 50 }: { count?: number }) {
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 2 + 1,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 3 + 2}s`,
      opacity: Math.random() * 0.7 + 0.3,
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" data-testid="star-field">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-stars-twinkle"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
