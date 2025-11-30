import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CountdownOverlayProps {
  seconds: number;
  onComplete: () => void;
  isActive: boolean;
}

export function CountdownOverlay({ seconds, onComplete, isActive }: CountdownOverlayProps) {
  const [count, setCount] = useState(seconds);

  useEffect(() => {
    if (!isActive) {
      setCount(seconds);
      return;
    }

    if (count <= 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, isActive, onComplete, seconds]);

  if (!isActive || count <= 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-space-dark/80 backdrop-blur-md"
      data-testid="countdown-overlay"
    >
      <div className="flex flex-col items-center gap-6">
        <p className="text-xl font-medium text-muted-foreground uppercase tracking-wider">
          Launching in
        </p>
        <div className="relative">
          <div 
            className={cn(
              "font-display text-8xl md:text-9xl font-bold text-celo-green animate-countdown-pulse",
              count === 1 && "text-orange-400",
            )}
            data-testid="countdown-number"
          >
            {count}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full border-4 border-celo-green/30 animate-pulse-ring" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Get ready for liftoff!
        </p>
      </div>
    </div>
  );
}
