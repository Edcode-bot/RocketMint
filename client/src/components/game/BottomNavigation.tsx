import { Home, Trophy, User, Wallet } from "lucide-react";
import { useLocation, Link } from "wouter";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/wallet", icon: Wallet, label: "Wallet" },
];

export function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-space-dark/90 backdrop-blur-xl safe-area-bottom"
      data-testid="bottom-navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-celo-green" 
                    : "text-muted-foreground"
                )}
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200",
                  isActive && "bg-celo-green/20"
                )}>
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-celo-green/10 animate-pulse-ring" />
                  )}
                </div>
                <span className={cn(
                  "text-xs font-medium transition-colors duration-200",
                  isActive ? "text-celo-green" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
