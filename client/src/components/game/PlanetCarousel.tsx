import { cn } from "@/lib/utils";
import { PLANETS, type Planet } from "@shared/schema";
import { useGameStore } from "@/lib/gameStore";

import { PlanetSVG } from "./PlanetSVG";

interface PlanetCarouselProps {
  onSelect?: (planet: Planet) => void;
  disabled?: boolean;
  landedPlanetId?: number;
}

export function PlanetCarousel({ onSelect, disabled = false, landedPlanetId }: PlanetCarouselProps) {
  const { selectedPlanet, setSelectedPlanet } = useGameStore();

  const handleSelect = (planet: Planet) => {
    if (disabled) return;
    setSelectedPlanet(planet);
    onSelect?.(planet);
  };

  return (
    <div className="w-full px-4" data-testid="planet-carousel">
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {PLANETS.map((planet) => {
          const isSelected = selectedPlanet?.id === planet.id;
          const isLanded = landedPlanetId === planet.id;

          return (
            <button
              key={planet.id}
              onClick={() => handleSelect(planet)}
              disabled={disabled}
              className={cn(
                "flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 snap-center",
                "border border-white/10 bg-gradient-to-b from-space-purple/50 to-space-dark/50",
                isSelected && "ring-2 ring-celo-green shadow-lg shadow-celo-green/20",
                isLanded && "ring-4 ring-yellow-400 shadow-xl shadow-yellow-400/40 animate-planet-glow scale-110",
                !disabled && "hover-elevate active-elevate-2",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              data-testid={`planet-${planet.name.toLowerCase()}`}
            >
              <div className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 transition-all flex items-center justify-center bg-space-dark/50",
                    isSelected
                      ? "border-celo-green shadow-lg shadow-celo-green/50"
                      : isLanded
                      ? "border-yellow-400 shadow-xl shadow-yellow-400/60"
                      : "border-white/20 hover:border-white/40"
                  )}
                >
                  <PlanetSVG planetId={planet.id} size="sm" />
                </div>
              </div>

              <div className="text-center">
                <p className={cn(
                  "font-semibold text-xs transition-colors duration-200",
                  isSelected ? "text-celo-green" : isLanded ? "text-yellow-400" : "text-foreground"
                )}>
                  {planet.name}
                </p>
                <p className={cn(
                  "text-[10px] font-medium",
                  isSelected ? "text-celo-yellow" : "text-muted-foreground"
                )}>
                  {planet.multiplier}x
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function PlanetDisplay({ planet, size = "md" }: { planet: Planet; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  };

  return (
    <div className={cn(
      "relative drop-shadow-2xl",
      sizeClasses[size]
    )}>
      <PlanetSVG planetId={planet.id} size={size} />
    </div>
  );
}