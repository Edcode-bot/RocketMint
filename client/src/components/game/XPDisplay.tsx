import { Star, Flame, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface XPDisplayProps {
  xp: number;
  level?: number;
  showProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

function calculateLevel(xp: number): { level: number; progress: number; xpForNextLevel: number } {
  const baseXP = 100;
  const multiplier = 1.5;
  
  let level = 1;
  let totalXPForLevel = baseXP;
  let accumulatedXP = 0;
  
  while (accumulatedXP + totalXPForLevel <= xp) {
    accumulatedXP += totalXPForLevel;
    level++;
    totalXPForLevel = Math.floor(baseXP * Math.pow(multiplier, level - 1));
  }
  
  const xpIntoCurrentLevel = xp - accumulatedXP;
  const progress = (xpIntoCurrentLevel / totalXPForLevel) * 100;
  
  return { level, progress, xpForNextLevel: totalXPForLevel };
}

export function XPDisplay({ xp, showProgress = false, size = "md" }: XPDisplayProps) {
  const { level, progress, xpForNextLevel } = calculateLevel(xp);
  
  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  return (
    <div className="flex flex-col gap-2" data-testid="xp-display">
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center rounded-full bg-celo-green/20",
          size === "sm" && "w-8 h-8",
          size === "md" && "w-10 h-10",
          size === "lg" && "w-12 h-12",
        )}>
          <Star className={cn(
            "text-celo-green",
            size === "sm" && "w-4 h-4",
            size === "md" && "w-5 h-5",
            size === "lg" && "w-6 h-6",
          )} />
        </div>
        
        <div>
          <p className={cn("font-display font-bold text-celo-green", sizeClasses[size])}>
            {xp.toLocaleString()} XP
          </p>
          <p className="text-xs text-muted-foreground">Level {level}</p>
        </div>
      </div>
      
      {showProgress && (
        <div className="space-y-1">
          <Progress 
            value={progress} 
            className="h-2 bg-white/10"
          />
          <p className="text-xs text-muted-foreground text-right">
            {Math.floor(progress)}% to Level {level + 1}
          </p>
        </div>
      )}
    </div>
  );
}

export function StatsGrid({ 
  predictions, 
  wins, 
  streak,
  bestStreak,
}: { 
  predictions: number; 
  wins: number; 
  streak: number;
  bestStreak: number;
}) {
  const winRate = predictions > 0 ? Math.round((wins / predictions) * 100) : 0;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4" data-testid="stats-grid">
      <StatCard
        icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        label="Predictions"
        value={predictions}
      />
      <StatCard
        icon={<Star className="w-5 h-5 text-yellow-400" />}
        label="Win Rate"
        value={`${winRate}%`}
      />
      <StatCard
        icon={<Flame className="w-5 h-5 text-orange-400" />}
        label="Current Streak"
        value={streak}
      />
      <StatCard
        icon={<Flame className="w-5 h-5 text-celo-green" />}
        label="Best Streak"
        value={bestStreak}
      />
    </div>
  );
}

function StatCard({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number | string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10">
      {icon}
      <span className="font-display text-xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
