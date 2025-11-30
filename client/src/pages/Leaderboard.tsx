import { Trophy, Medal, Crown, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { StarField } from "@/components/game/StarField";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { useGameStore } from "@/lib/gameStore";
import { shortenAddress } from "@/lib/wallet";
import type { LeaderboardEntry } from "@shared/schema";

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, walletAddress: "0x1234...5678", username: "CryptoKing", xp: 15420, totalPredictions: 234, winRate: 68, badges: ["first_prediction", "winning_streak_5", "xp_5000"] },
  { rank: 2, walletAddress: "0x2345...6789", username: "MoonHunter", xp: 12350, totalPredictions: 189, winRate: 62, badges: ["first_prediction", "winning_streak_3", "xp_1000"] },
  { rank: 3, walletAddress: "0x3456...7890", username: "StarGazer", xp: 10890, totalPredictions: 156, winRate: 58, badges: ["first_prediction", "predictions_50", "xp_1000"] },
  { rank: 4, walletAddress: "0x4567...8901", xp: 8760, totalPredictions: 134, winRate: 55, badges: ["first_prediction", "predictions_10"] },
  { rank: 5, walletAddress: "0x5678...9012", username: "RocketRider", xp: 7650, totalPredictions: 112, winRate: 52, badges: ["first_prediction"] },
  { rank: 6, walletAddress: "0x6789...0123", xp: 6540, totalPredictions: 98, winRate: 50, badges: ["first_prediction"] },
  { rank: 7, walletAddress: "0x7890...1234", username: "PlanetPro", xp: 5430, totalPredictions: 87, winRate: 48, badges: ["first_prediction"] },
  { rank: 8, walletAddress: "0x8901...2345", xp: 4320, totalPredictions: 76, winRate: 46, badges: [] },
  { rank: 9, walletAddress: "0x9012...3456", xp: 3210, totalPredictions: 65, winRate: 44, badges: [] },
  { rank: 10, walletAddress: "0x0123...4567", xp: 2100, totalPredictions: 54, winRate: 42, badges: [] },
];

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-400" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-300" />;
    case 3:
      return <Medal className="w-5 h-5 text-amber-600" />;
    default:
      return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
  }
}

function getRankBackground(rank: number) {
  switch (rank) {
    case 1:
      return "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30";
    case 2:
      return "bg-gradient-to-r from-gray-300/20 to-gray-400/10 border-gray-300/30";
    case 3:
      return "bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30";
    default:
      return "bg-white/5 border-white/10";
  }
}

export default function Leaderboard() {
  const { wallet, user } = useGameStore();
  
  const { data: leaderboard, isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ["/api/leaderboard"],
  });

  const displayData = leaderboard || mockLeaderboard;
  const top3 = displayData.slice(0, 3);
  const rest = displayData.slice(3);

  return (
    <div className="min-h-screen bg-background pb-24">
      <StarField count={40} />
      
      <header className="sticky top-0 z-10 p-4 bg-background/80 backdrop-blur-lg border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Leaderboard</h1>
            <p className="text-xs text-muted-foreground">Top RocketMint Players</p>
          </div>
        </div>
      </header>
      
      <main className="relative z-10 p-4 space-y-6">
        <Tabs defaultValue="all-time" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/5">
            <TabsTrigger value="all-time" data-testid="tab-all-time">All Time</TabsTrigger>
            <TabsTrigger value="weekly" data-testid="tab-weekly">This Week</TabsTrigger>
            <TabsTrigger value="daily" data-testid="tab-daily">Today</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all-time" className="mt-6 space-y-6">
            {isLoading ? (
              <LeaderboardSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 0, 2].map((index) => {
                    const entry = top3[index];
                    if (!entry) return null;
                    
                    return (
                      <div
                        key={entry.rank}
                        className={cn(
                          "flex flex-col items-center p-4 rounded-2xl border transition-all",
                          getRankBackground(entry.rank),
                          entry.rank === 1 && "scale-105 -translate-y-2"
                        )}
                        data-testid={`podium-${entry.rank}`}
                      >
                        <div className={cn(
                          "w-12 h-12 rounded-full flex items-center justify-center mb-2",
                          entry.rank === 1 && "bg-yellow-500/30 ring-2 ring-yellow-400",
                          entry.rank === 2 && "bg-gray-300/30 ring-2 ring-gray-300",
                          entry.rank === 3 && "bg-amber-600/30 ring-2 ring-amber-600"
                        )}>
                          {getRankIcon(entry.rank)}
                        </div>
                        <p className="font-semibold text-sm truncate max-w-full">
                          {entry.username || shortenAddress(entry.walletAddress)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {entry.xp.toLocaleString()} XP
                        </p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {entry.winRate}% Win
                        </Badge>
                      </div>
                    );
                  })}
                </div>
                
                <Card className="border-white/10 bg-card/50 backdrop-blur">
                  <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                      {rest.map((entry) => (
                        <LeaderboardRow 
                          key={entry.rank} 
                          entry={entry}
                          isCurrentUser={wallet.address === entry.walletAddress}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {user && wallet.address && (
                  <Card className="border-celo-green/30 bg-celo-green/10">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-celo-green/20 flex items-center justify-center">
                            <Star className="w-5 h-5 text-celo-green" />
                          </div>
                          <div>
                            <p className="font-semibold">Your Ranking</p>
                            <p className="text-sm text-muted-foreground">
                              {shortenAddress(wallet.address)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl font-bold text-celo-green">
                            {user.xp.toLocaleString()} XP
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.totalPredictions} predictions
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Weekly leaderboard resets every Monday</p>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="mt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Trophy className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Daily leaderboard resets at midnight UTC</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function LeaderboardRow({ entry, isCurrentUser }: { entry: LeaderboardEntry; isCurrentUser: boolean }) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between p-4 transition-colors",
        isCurrentUser && "bg-celo-green/10"
      )}
      data-testid={`leaderboard-row-${entry.rank}`}
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
          {getRankIcon(entry.rank)}
        </div>
        <div>
          <p className={cn(
            "font-medium",
            isCurrentUser && "text-celo-green"
          )}>
            {entry.username || shortenAddress(entry.walletAddress)}
          </p>
          <p className="text-xs text-muted-foreground">
            {entry.totalPredictions} predictions
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display font-bold">{entry.xp.toLocaleString()}</p>
        <p className="text-xs text-muted-foreground">{entry.winRate}% win rate</p>
      </div>
    </div>
  );
}

function LeaderboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 rounded-2xl" />
        ))}
      </div>
      <Card className="border-white/10">
        <CardContent className="p-0">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0">
              <Skeleton className="w-8 h-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
