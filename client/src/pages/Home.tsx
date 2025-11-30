import { useState, useCallback } from "react";
import { Rocket, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { StarField } from "@/components/game/StarField";
import { GameSection } from "@/components/game/GameSection";
import { WalletConnect, WalletStatus } from "@/components/game/WalletConnect";
import { CountdownOverlay } from "@/components/game/CountdownOverlay";
import { ResultsModal } from "@/components/game/ResultsModal";
import { useGameStore, getRandomPlanet, calculateXP, getPlanetById, getRandomPlanetDeterministic, PLANETS } from "@/lib/gameStore";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { saveGameResult } from "@/lib/firestore";
import spaceBackground from "@assets/generated_images/deep_space_nebula_background.png";

export default function Home() {
  const { 
    wallet, 
    selectedPlanet, 
    isLaunching, 
    setIsLaunching,
    showResults,
    setShowResults,
    lastResult,
    setLastResult,
    resetGame,
    user,
    setUser,
  } = useGameStore();

  const [isShaking, setIsShaking] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const { toast } = useToast();

  const predictionMutation = useMutation({
    mutationFn: async (data: { walletAddress: string; planetId: number }) => {
      return await apiRequest("POST", "/api/predictions", data);
    },
    onSuccess: () => {
      startLaunchSequence();
    },
    onError: (error) => {
      toast({
        title: "Prediction Failed",
        description: error instanceof Error ? error.message : "Failed to submit prediction",
        variant: "destructive",
      });
    },
  });

  const startLaunchSequence = useCallback(() => {
    setIsShaking(true);
    setShowCountdown(true);
  }, []);

  const handleCountdownComplete = useCallback(() => {
    setShowCountdown(false);
    setIsShaking(false);
    setIsLaunching(true);

    setTimeout(() => {
      const landedPlanet = getRandomPlanet();
      const won = selectedPlanet?.id === landedPlanet.id;
      const xpEarned = calculateXP(won, landedPlanet);

      setLastResult({
        won,
        landedPlanet,
        xpEarned,
      });

      setIsLaunching(false);
      setShowResults(true);

      if (user) {
        setUser({
          ...user,
          xp: user.xp + xpEarned,
          totalPredictions: user.totalPredictions + 1,
          correctPredictions: won ? user.correctPredictions + 1 : user.correctPredictions,
          currentStreak: won ? user.currentStreak + 1 : 0,
          bestStreak: won && user.currentStreak + 1 > user.bestStreak 
            ? user.currentStreak + 1 
            : user.bestStreak,
        });
      }
    }, 3500);
  }, [selectedPlanet, setIsLaunching, setLastResult, setShowResults, user, setUser]);

  const handleLaunch = useCallback(() => {
    if (!wallet.isConnected || !selectedPlanet) {
      toast({
        title: "Cannot Launch",
        description: !wallet.isConnected ? "Please connect your wallet first" : "Please select a planet",
        variant: "destructive",
      });
      return;
    }

    // Start shaking animation
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
      setShowCountdown(true);

      // 3-second countdown
      let countdownValue = 3;
      const countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue <= 0) {
          clearInterval(countdownInterval);

          // Launch rocket
          setShowCountdown(false);
          setIsLaunching(true);

          // Generate deterministic random result
          const walletPart = wallet.address || "anonymous";
          const seed = `${walletPart}-${selectedPlanet.id}-${Date.now()}`;
          
          let landedPlanet;
          let usedSeed;
          let index;
          
          try {
            const result = getRandomPlanetDeterministic(seed);
            landedPlanet = result.planet;
            usedSeed = result.seed;
            index = result.index;
          } catch (error) {
            console.error("[RocketMint] Client random failed, defaulting to Earth:", error);
            landedPlanet = getPlanetById(3) || PLANETS[0];
            usedSeed = seed;
            index = 0;
          }

          // Simulate flight time
          setTimeout(() => {
            setIsLaunching(false);

            const won = landedPlanet.id === selectedPlanet.id;
            const xpEarned = calculateXP(won, selectedPlanet);

            setLastResult({
              won,
              landedPlanet,
              xpEarned,
            });

            setShowResults(true);

            // Save to Firestore (client-side for now, move to Cloud Functions for security)
            if (user && wallet.address) {
              saveGameResult({
                walletAddress: wallet.address,
                username: user.username,
                xp: user.xp + xpEarned,
                totalPredictions: user.totalPredictions + 1,
                correctPredictions: won ? user.correctPredictions + 1 : user.correctPredictions,
                timestamp: Date.now()
              }).catch(err => console.error("[RocketMint] Failed to save to Firestore:", err));
            }

            // Console log for debugging and on-chain integration
            console.log(`[RocketMint] Client prediction result:`, {
              seed: usedSeed,
              selectedPlanet: selectedPlanet.id,
              landedPlanet: landedPlanet.id,
              won,
              xpEarned,
              randomIndex: index
            });

            // TODO: On-chain integration hooks
            console.log(`[RocketMint] On-chain integration ready:`, {
              contractFunction: "submitPrediction",
              eventListener: "PredictionResolved",
              prediction: selectedPlanet.id,
              result: landedPlanet.id,
              won,
              xpEarned
            });
          }, 2000);
        }
      }, 1000);
    }, 1000);

    // Submit to backend (non-blocking)
    predictionMutation.mutate({
      walletAddress: wallet.address!,
      planetId: selectedPlanet.id,
    });
  }, [wallet, selectedPlanet, predictionMutation, toast, setIsShaking, setShowCountdown, setIsLaunching, setLastResult, setShowResults]);

  const handlePlayAgain = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handleCloseResults = useCallback(() => {
    setShowResults(false);
  }, [setShowResults]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-hidden">
      <StarField count={80} />

      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url(${spaceBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-celo-gradient flex items-center justify-center">
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">RocketMint</h1>
            <p className="text-xs text-muted-foreground">Celo Prediction Game</p>
          </div>
        </div>
        <WalletStatus />
      </header>

      <main className="relative z-10 flex-1 flex flex-col pb-24">
        <section className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <div className="text-center mb-8">
            <Badge variant="secondary" className="mb-4 bg-celo-green/20 text-celo-green border-celo-green/30">
              <Zap className="w-3 h-3 mr-1" />
              Alfajores Testnet
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2">
              Predict the Landing
            </h2>
            <p className="text-muted-foreground max-w-md">
              Choose a planet, launch the rocket, and earn XP rewards for correct predictions!
            </p>
          </div>

          <GameSection 
            isLaunching={isLaunching}
            isShaking={isShaking}
            disabled={isLaunching || isShaking}
          />
        </section>

        <section className="px-4 py-4">
          <WalletConnect />
        </section>

        <div className="fixed bottom-20 left-0 right-0 px-4 z-20">
          <Button
            onClick={handleLaunch}
            disabled={!wallet.isConnected || !selectedPlanet || isLaunching || isShaking || predictionMutation.isPending}
            className={cn(
              "w-full h-14 text-lg font-bold rounded-full shadow-xl transition-all duration-300",
              "bg-celo-gradient hover:brightness-110",
              selectedPlanet && wallet.isConnected && "animate-bounce-subtle"
            )}
            data-testid="button-launch"
          >
            {predictionMutation.isPending ? (
              "Submitting..."
            ) : isLaunching ? (
              "Launching..."
            ) : isShaking ? (
              "Preparing..."
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-2" />
                Launch Rocket
              </>
            )}
          </Button>
        </div>
      </main>

      <CountdownOverlay
        seconds={3}
        isActive={showCountdown}
        onComplete={handleCountdownComplete}
      />

      <ResultsModal
        isOpen={showResults}
        onClose={handleCloseResults}
        onPlayAgain={handlePlayAgain}
      />
    </div>
  );
}