import { useState, useEffect } from "react";
import { User, Star, Flame, Trophy, History, Settings, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarField } from "@/components/game/StarField";
import { XPDisplay, StatsGrid } from "@/components/game/XPDisplay";
import { BadgeDisplay, BadgeCard } from "@/components/game/BadgeDisplay";
import { PlanetDisplay } from "@/components/game/PlanetCarousel";
import { useGameStore, getPlanetById } from "@/lib/gameStore";
import { shortenAddress } from "@/lib/wallet";
import { BADGES, PLANETS } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PredictionHistory {
  id: string;
  planetId: number;
  won: boolean;
  xpEarned: number;
  timestamp: number;
}

const mockHistory: PredictionHistory[] = [
  { id: "1", planetId: 1, won: true, xpEarned: 100, timestamp: Date.now() - 3600000 },
  { id: "2", planetId: 3, won: false, xpEarned: 10, timestamp: Date.now() - 7200000 },
  { id: "3", planetId: 2, won: true, xpEarned: 75, timestamp: Date.now() - 10800000 },
  { id: "4", planetId: 5, won: true, xpEarned: 125, timestamp: Date.now() - 14400000 },
  { id: "5", planetId: 4, won: false, xpEarned: 10, timestamp: Date.now() - 18000000 },
];

export default function Profile() {
  const { wallet, user, setUser } = useGameStore();
  const [history] = useState<PredictionHistory[]>(mockHistory);

  useEffect(() => {
    if (wallet.isConnected && !user) {
      setUser({
        id: wallet.address || "guest",
        walletAddress: wallet.address || "",
        xp: 1250,
        totalPredictions: 47,
        correctPredictions: 28,
        currentStreak: 3,
        bestStreak: 7,
        badges: ["first_prediction", "winning_streak_3", "predictions_10", "xp_1000"],
        createdAt: Date.now() - 86400000 * 7,
      });
    }
  }, [wallet.isConnected, user, wallet.address, setUser]);

  if (!wallet.isConnected) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <StarField count={40} />
        
        <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-celo-green/20 flex items-center justify-center">
              <User className="w-5 h-5 text-celo-green" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Profile</h1>
              <p className="text-xs text-muted-foreground">Your RocketMint Stats</p>
            </div>
          </div>
        </header>
        
        <main className="relative z-10 flex flex-col items-center justify-center p-4 min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              <User className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground max-w-sm">
              Connect your wallet to view your profile, stats, and prediction history.
            </p>
            <Button 
              className="bg-celo-gradient hover:brightness-110"
              onClick={() => window.location.href = "/"}
              data-testid="button-go-home"
            >
              Go to Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const winRate = user && user.totalPredictions > 0 
    ? Math.round((user.correctPredictions / user.totalPredictions) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-background pb-24">
      <StarField count={40} />
      
      <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-celo-green/20 flex items-center justify-center">
              <User className="w-5 h-5 text-celo-green" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Profile</h1>
              <p className="text-xs text-muted-foreground">Your RocketMint Stats</p>
            </div>
          </div>
          <Button size="icon" variant="ghost">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>
      
      <main className="relative z-10 p-4 space-y-6">
        <Card className="border-white/10 bg-gradient-to-b from-space-purple/30 to-space-dark/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-20 h-20 border-4 border-celo-green/30">
                <AvatarFallback className="bg-celo-green/20 text-celo-green text-2xl font-bold">
                  {wallet.address?.slice(2, 4).toUpperCase() || "??"}
                </AvatarFallback>
              </Avatar>
              
              <div className="mt-4">
                <p className="font-mono text-sm text-muted-foreground">
                  {shortenAddress(wallet.address || "")}
                </p>
                {wallet.isMiniPay && (
                  <Badge variant="secondary" className="mt-2 bg-celo-green/20 text-celo-green border-celo-green/30">
                    MiniPay User
                  </Badge>
                )}
              </div>
              
              <div className="mt-6 w-full">
                <XPDisplay xp={user?.xp || 0} showProgress size="lg" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <StatsGrid
          predictions={user?.totalPredictions || 0}
          wins={user?.correctPredictions || 0}
          streak={user?.currentStreak || 0}
          bestStreak={user?.bestStreak || 0}
        />
        
        <Tabs defaultValue="badges" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5">
            <TabsTrigger value="badges" data-testid="tab-badges">
              <Trophy className="w-4 h-4 mr-2" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="history" data-testid="tab-history">
              <History className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="badges" className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Your Badges</h3>
              <Badge variant="outline">
                {user?.badges.length || 0} / {BADGES.length}
              </Badge>
            </div>
            
            <div className="grid gap-3">
              {BADGES.map((badge) => (
                <BadgeCard 
                  key={badge.id} 
                  badge={badge} 
                  isEarned={user?.badges.includes(badge.id) || false}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6 space-y-4">
            <h3 className="font-semibold">Recent Predictions</h3>
            
            <div className="space-y-3">
              {history.map((prediction) => {
                const planet = getPlanetById(prediction.planetId);
                if (!planet) return null;
                
                return (
                  <Card key={prediction.id} className="border-white/10 bg-white/5">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <PlanetDisplay planet={planet} size="sm" />
                          <div>
                            <p className="font-medium">{planet.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(prediction.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={prediction.won ? "default" : "secondary"}
                            className={cn(
                              prediction.won 
                                ? "bg-celo-green/20 text-celo-green border-celo-green/30" 
                                : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                            )}
                          >
                            {prediction.won ? "Won" : "Lost"}
                          </Badge>
                          <p className={cn(
                            "text-sm font-bold mt-1",
                            prediction.won ? "text-celo-green" : "text-orange-400"
                          )}>
                            +{prediction.xpEarned} XP
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {history.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <History className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No predictions yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start playing to see your history
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <ExternalLink className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">View on Explorer</p>
                  <p className="text-xs text-muted-foreground">Alfajores Celoscan</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(`https://alfajores.celoscan.io/address/${wallet.address}`, "_blank")}
                data-testid="button-view-explorer"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
