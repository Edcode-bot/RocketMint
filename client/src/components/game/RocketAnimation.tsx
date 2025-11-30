import { cn } from "@/lib/utils";
import rocketImage from "@assets/generated_images/futuristic_celo-green_rocket_ship.png";

interface RocketAnimationProps {
  isLaunching: boolean;
  isShaking: boolean;
  className?: string;
}

export function RocketAnimation({ isLaunching, isShaking, className }: RocketAnimationProps) {
  return (
    <div className={cn("relative", className)} data-testid="rocket-animation">
      <div className={cn(
        "relative z-10 transition-all duration-300",
        isLaunching && "animate-rocket-launch",
        isShaking && !isLaunching && "animate-rocket-shake"
      )}>
        <img
          src={rocketImage}
          alt="Rocket"
          className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
        />
        
        {(isLaunching || isShaking) && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-8 h-16 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full blur-sm animate-thruster-flicker" />
            <div className="absolute w-6 h-12 bg-gradient-to-t from-orange-600 via-yellow-300 to-transparent rounded-full animate-thruster-flicker" style={{ animationDelay: "0.05s" }} />
            <div className="absolute w-4 h-8 bg-gradient-to-t from-white via-yellow-200 to-transparent rounded-full animate-thruster-flicker" style={{ animationDelay: "0.1s" }} />
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-stars-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export function LaunchPad() {
  return (
    <div className="relative w-full h-24 mt-4" data-testid="launch-pad">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-gradient-to-r from-transparent via-celo-green/30 to-transparent rounded-full blur-lg" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-4 bg-gradient-to-r from-space-purple via-space-blue to-space-purple rounded-full border border-white/10" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-2 bg-gradient-to-r from-transparent via-celo-green/50 to-transparent" />
    </div>
  );
}
