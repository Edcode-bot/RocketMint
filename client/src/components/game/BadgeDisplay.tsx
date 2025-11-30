import { 
  Rocket, 
  Flame, 
  Compass, 
  Telescope, 
  Star, 
  Crown,
  Zap,
  LockKeyhole,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BADGES, type Badge } from "@shared/schema";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: Record<string, React.ElementType> = {
  rocket: Rocket,
  flame: Flame,
  fire: Zap,
  compass: Compass,
  telescope: Telescope,
  star: Star,
  crown: Crown,
};

interface BadgeDisplayProps {
  earnedBadges: string[];
  showLocked?: boolean;
  size?: "sm" | "md" | "lg";
}

export function BadgeDisplay({ earnedBadges, showLocked = true, size = "md" }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };
  
  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-7 h-7",
    lg: "w-10 h-10",
  };

  return (
    <div className="flex flex-wrap gap-3" data-testid="badge-display">
      {BADGES.map((badge) => {
        const isEarned = earnedBadges.includes(badge.id);
        const Icon = iconMap[badge.icon] || Star;
        
        if (!showLocked && !isEarned) return null;
        
        return (
          <Tooltip key={badge.id}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  "relative rounded-xl flex items-center justify-center transition-all duration-200",
                  sizeClasses[size],
                  isEarned 
                    ? "bg-gradient-to-br from-celo-green/30 to-celo-green/10 border border-celo-green/50"
                    : "bg-white/5 border border-white/10 grayscale opacity-40"
                )}
                data-testid={`badge-${badge.id}`}
              >
                {isEarned ? (
                  <Icon className={cn(iconSizes[size], "text-celo-green")} />
                ) : (
                  <LockKeyhole className={cn(iconSizes[size], "text-muted-foreground")} />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="text-center">
                <p className="font-semibold">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                <p className="text-xs text-celo-green mt-2">{badge.requirement}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}

export function BadgeCard({ badge, isEarned }: { badge: Badge; isEarned: boolean }) {
  const Icon = iconMap[badge.icon] || Star;
  
  return (
    <div 
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200",
        isEarned 
          ? "bg-celo-green/10 border-celo-green/30"
          : "bg-white/5 border-white/10 opacity-60"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-xl flex items-center justify-center",
        isEarned ? "bg-celo-green/20" : "bg-white/10"
      )}>
        {isEarned ? (
          <Icon className="w-6 h-6 text-celo-green" />
        ) : (
          <LockKeyhole className="w-6 h-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className={cn(
          "font-semibold",
          isEarned ? "text-foreground" : "text-muted-foreground"
        )}>
          {badge.name}
        </p>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
      </div>
      {isEarned && (
        <div className="w-6 h-6 rounded-full bg-celo-green flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
}
