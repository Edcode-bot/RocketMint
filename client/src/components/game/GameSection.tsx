
import { cn } from "@/lib/utils";
import { RocketAnimation, LaunchPad } from "./RocketAnimation";
import { PlanetCarousel } from "./PlanetCarousel";
import { useGameStore } from "@/lib/gameStore";

interface GameSectionProps {
  isLaunching: boolean;
  isShaking: boolean;
  disabled?: boolean;
}

export function GameSection({ isLaunching, isShaking, disabled = false }: GameSectionProps) {
  return (
    <div className={cn(
      "relative w-full max-w-md mx-auto",
      "min-h-[500px] md:min-h-[600px]",
      "flex flex-col items-center justify-between",
      "bg-gradient-to-b from-space-purple/20 to-transparent",
      "rounded-2xl border border-white/10 p-4"
    )}>
      {/* Planet Carousel at Top */}
      <div className="w-full mb-6">
        <h3 className="font-semibold text-sm mb-3 text-center text-muted-foreground">
          Select Your Destination
        </h3>
        <PlanetCarousel disabled={disabled} />
      </div>
      
      {/* Rocket Animation in Center */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <RocketAnimation 
          isLaunching={isLaunching} 
          isShaking={isShaking}
          className="mb-4"
        />
        <LaunchPad />
      </div>
    </div>
  );
}
