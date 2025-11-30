import { useEffect, useState } from "react";
import { Trophy, X, RotateCcw, Star, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/gameStore";
import { PlanetDisplay } from "./PlanetCarousel";

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
}

export function ResultsModal({ isOpen, onClose, onPlayAgain }: ResultsModalProps) {
  const { lastResult, selectedPlanet } = useGameStore();
  const [showXP, setShowXP] = useState(false);
  const [displayedXP, setDisplayedXP] = useState(0);

  useEffect(() => {
    if (isOpen && lastResult) {
      setShowXP(false);
      setDisplayedXP(0);
      
      const timer = setTimeout(() => {
        setShowXP(true);
        
        const targetXP = lastResult.xpEarned;
        const duration = 1000;
        const steps = 30;
        const increment = targetXP / steps;
        let current = 0;
        
        const interval = setInterval(() => {
          current += increment;
          if (current >= targetXP) {
            setDisplayedXP(targetXP);
            clearInterval(interval);
          } else {
            setDisplayedXP(Math.floor(current));
          }
        }, duration / steps);
        
        return () => clearInterval(interval);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, lastResult]);

  if (!isOpen || !lastResult) return null;

  const won = lastResult.won;
  const landedPlanet = lastResult.landedPlanet;
  const predictedCorrectly = selectedPlanet?.id === landedPlanet.id;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-dark/90 backdrop-blur-lg"
      data-testid="results-modal"
    >
      <div className="relative w-full max-w-md animate-slide-up">
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
          data-testid="button-close-results"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className={cn(
          "rounded-3xl border p-8 text-center",
          won 
            ? "border-celo-green/30 bg-gradient-to-b from-celo-green/10 to-space-dark/90" 
            : "border-orange-500/30 bg-gradient-to-b from-orange-500/10 to-space-dark/90"
        )}>
          <div className="flex flex-col items-center gap-6">
            <div className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center",
              won ? "bg-celo-green/20" : "bg-orange-500/20"
            )}>
              {won ? (
                <Trophy className="w-10 h-10 text-celo-green" />
              ) : (
                <Star className="w-10 h-10 text-orange-400" />
              )}
            </div>
            
            <div>
              <h2 className={cn(
                "font-display text-3xl font-bold",
                won ? "text-celo-green" : "text-orange-400"
              )}>
                {won ? "You Won!" : "Better Luck Next Time!"}
              </h2>
              <p className="text-muted-foreground mt-2">
                {won 
                  ? "Your prediction was correct!" 
                  : "Keep trying to improve your streak!"}
              </p>
            </div>
            
            <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-3">Rocket landed on</p>
              <div className="flex items-center justify-center gap-4">
                <PlanetDisplay planet={landedPlanet} size="md" />
                <div className="text-left">
                  <p className="font-display text-xl font-bold">{landedPlanet.name}</p>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "mt-1",
                      predictedCorrectly 
                        ? "border-celo-green/50 text-celo-green" 
                        : "border-orange-400/50 text-orange-400"
                    )}
                  >
                    {predictedCorrectly ? "Predicted!" : `You picked ${selectedPlanet?.name}`}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-1">XP Earned</p>
                <div className="flex items-center gap-2">
                  <Flame className={cn(
                    "w-5 h-5",
                    won ? "text-celo-green" : "text-orange-400"
                  )} />
                  <span 
                    className={cn(
                      "font-display text-3xl font-bold transition-all duration-300",
                      showXP ? "opacity-100" : "opacity-0",
                      won ? "text-celo-green" : "text-orange-400"
                    )}
                    data-testid="text-xp-earned"
                  >
                    +{displayedXP}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 w-full mt-4">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={onClose}
                data-testid="button-view-leaderboard"
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Button>
              <Button
                className="flex-1 gap-2 bg-celo-gradient hover:brightness-110"
                onClick={onPlayAgain}
                data-testid="button-play-again"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
