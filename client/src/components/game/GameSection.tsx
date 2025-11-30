import { cn } from "@/lib/utils";
import { PlanetCarousel } from "./PlanetCarousel";
import { useGameStore } from "@/lib/gameStore";
import { AnimatedBackground } from "./AnimatedBackground";
import { SmokeTrail } from "./SmokeTrail";
import rocketImage from "@assets/generated_images/futuristic_celo-green_rocket_ship.png";
import launchPadImage from "@assets/generated_images/futuristic_space_launch_pad.png";

interface GameSectionProps {
  isLaunching: boolean;
  isShaking: boolean;
  disabled?: boolean;
  landedPlanetId?: number;
}

export function GameSection({ isLaunching, isShaking, disabled = false, landedPlanetId }: GameSectionProps) {
  const { selectedPlanet } = useGameStore();

  return (
    <div 
      className={cn(
        "game-container relative w-full max-w-lg mx-auto",
        "min-h-[520px] md:min-h-[600px]",
        "flex flex-col",
        "rounded-2xl overflow-hidden",
        "border-2 border-celo-green/30",
        "shadow-[0_0_30px_rgba(53,208,127,0.15)]"
      )}
      data-testid="game-section"
    >
      <AnimatedBackground />
      
      <div className="relative z-10 flex flex-col h-full p-4">
        <div className="w-full mb-4">
          <h3 className="font-display font-semibold text-sm mb-3 text-center text-celo-green/80 tracking-wide uppercase">
            Choose Your Destination
          </h3>
          <PlanetCarousel disabled={disabled} landedPlanetId={landedPlanetId} />
        </div>

        <div className="flex-1 flex items-end justify-start relative">
          <div className="relative">
            <div 
              className={cn(
                "relative transition-all duration-300",
                isShaking && !isLaunching && "animate-rocket-shake",
                isLaunching && "animate-rocket-fly-up"
              )}
            >
              <img
                src={rocketImage}
                alt="Rocket"
                className="w-24 h-24 md:w-32 md:h-32 object-contain drop-shadow-[0_0_15px_rgba(53,208,127,0.4)]"
                data-testid="rocket-image"
              />
              
              {(isLaunching || isShaking) && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div className="w-6 h-12 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm animate-thruster-flicker" />
                  <div className="absolute w-4 h-8 bg-gradient-to-t from-orange-600 via-yellow-300 to-transparent rounded-full animate-thruster-flicker" style={{ animationDelay: "0.05s" }} />
                  <div className="absolute w-3 h-6 bg-gradient-to-t from-white via-yellow-200 to-transparent rounded-full animate-thruster-flicker" style={{ animationDelay: "0.1s" }} />
                </div>
              )}
            </div>

            <SmokeTrail isActive={isShaking} isLaunching={isLaunching} />

            <div className="relative mt-2" data-testid="launch-pad">
              <img
                src={launchPadImage}
                alt="Launch Pad"
                className="w-32 h-16 md:w-40 md:h-20 object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-celo-green/20 to-transparent rounded-full blur-md animate-pulse" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
            </div>
          </div>

          {isLaunching && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-celo-green/60 animate-particle-burst"
                  style={{
                    left: "15%",
                    bottom: "20%",
                    animationDelay: `${i * 0.1}s`,
                    transform: `rotate(${i * 45}deg)`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-xs">
          <span className="text-muted-foreground/50">Powered by</span>
          <span className="text-celo-yellow font-semibold">Celo</span>
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none border-2 border-celo-green/10 rounded-2xl" 
           style={{ boxShadow: "inset 0 0 60px rgba(53,208,127,0.05)" }} />
    </div>
  );
}
