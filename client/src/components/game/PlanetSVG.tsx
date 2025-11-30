
interface PlanetSVGProps {
  planetId: number;
  size?: "sm" | "md" | "lg";
}

export function PlanetSVG({ planetId, size = "md" }: PlanetSVGProps) {
  const sizeClass = size === "sm" ? "w-12 h-12" : size === "lg" ? "w-32 h-32" : "w-20 h-20";

  const getPlanetSVG = () => {
    switch (planetId) {
      case 1: // Mars (Red)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#E74C3C"/>
            <circle cx="20" cy="24" r="4" fill="#C0392B" opacity="0.6"/>
            <circle cx="40" cy="36" r="6" fill="#C0392B" opacity="0.6"/>
            <circle cx="28" cy="42" r="3" fill="#C0392B" opacity="0.6"/>
          </svg>
        );
      case 2: // Terra (Blue-Green)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#3498DB"/>
            <path d="M15 25 Q20 20, 28 22 T38 18 L42 28 Q38 35, 30 32 T18 38 Z" fill="#27AE60" opacity="0.8"/>
            <path d="M45 35 Q50 30, 54 35 L52 45 Q45 42, 42 38 Z" fill="#27AE60" opacity="0.8"/>
          </svg>
        );
      case 3: // Earth (default fallback)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#3498DB"/>
            <path d="M10 28 Q15 22, 25 25 T40 20 L45 32 Q40 40, 28 38 T12 42 Z" fill="#27AE60" opacity="0.9"/>
            <circle cx="50" cy="20" r="8" fill="#ECF0F1" opacity="0.7"/>
          </svg>
        );
      case 4: // Saturn (Yellow with ring)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <ellipse cx="32" cy="32" rx="30" ry="8" fill="#F39C12" opacity="0.4"/>
            <circle cx="32" cy="32" r="20" fill="#F39C12"/>
            <ellipse cx="32" cy="32" rx="30" ry="8" fill="none" stroke="#E67E22" strokeWidth="2"/>
          </svg>
        );
      case 5: // Nebula (Purple mystical)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#9B59B6"/>
            <circle cx="24" cy="28" r="8" fill="#8E44AD" opacity="0.6"/>
            <circle cx="40" cy="36" r="10" fill="#8E44AD" opacity="0.6"/>
            <circle cx="32" cy="32" r="6" fill="#E8DAEF" opacity="0.8"/>
          </svg>
        );
      case 6: // Frost (Ice blue)
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#5DADE2"/>
            <path d="M20 20 L32 32 L20 44" stroke="#EBF5FB" strokeWidth="2" fill="none"/>
            <path d="M44 20 L32 32 L44 44" stroke="#EBF5FB" strokeWidth="2" fill="none"/>
            <circle cx="32" cy="32" r="8" fill="#EBF5FB" opacity="0.6"/>
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className={sizeClass}>
            <circle cx="32" cy="32" r="28" fill="#95A5A6"/>
          </svg>
        );
    }
  };

  return <div className="inline-block">{getPlanetSVG()}</div>;
}
