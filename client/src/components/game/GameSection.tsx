
import { cn } from "@/lib/utils";
import { RocketSVG } from "./RocketSVG";
import { PlanetSVG } from "./PlanetSVG";
import { PlanetCarousel } from "./PlanetCarousel";
import { useGameStore } from "@/lib/gameStore";

interface GameSectionProps {
  isLaunching: boolean;
  isShaking: boolean;
  disabled?: boolean;
}

export function GameSection({ isLaunching, isShaking, disabled = false }: GameSectionProps) {
  const { selectedPlanet } = useGameStore();

  return (
    <div className={cn(
      "game-box relative w-full max-w-md mx-auto",
      "min-h-[500px] md:min-h-[600px]",
      "flex flex-col items-center justify-between",
      "bg-gradient-to-b from-space-purple/20 to-transparent",
      "rounded-2xl border border-white/10 p-4"
    )}>
      {/* Planet Carousel at Top */}
      <div className="w-full mb-6 z-20 relative">
        <h3 className="font-semibold text-sm mb-3 text-center text-muted-foreground">
          Select Your Destination
        </h3>
        <PlanetCarousel disabled={disabled} />
      </div>
      
      {/* Rocket Animation in Center */}
      <div className="flex-1 flex flex-col items-center justify-end relative z-10">
        <RocketSVG 
          isLaunching={isLaunching} 
          isShaking={isShaking}
          targetPlanetId={selectedPlanet?.id}
        />
        <div className="w-32 h-2 bg-white/20 rounded-full mt-4" />
      </div>
    </div>
  );
}
