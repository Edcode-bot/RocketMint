import { create } from "zustand";
import type { WalletState, Planet, GameState, User, Prediction } from "@shared/schema";

// Planet definitions with proper colors for SVG rendering
export const PLANETS: Planet[] = [
  {
    id: "earth",
    name: "Earth",
    color: "blue",
    chance: 50,
    xp: 50,
    image: "/images/planets/blue_earth-like_planet.png"
  },
  {
    id: "mars",
    name: "Mars",
    color: "red",
    chance: 30,
    xp: 100,
    image: "/images/planets/red_mars-like_planet.png"
  },
  {
    id: "saturn",
    name: "Saturn",
    color: "yellow",
    chance: 15,
    xp: 200,
    image: "/images/planets/golden_ringed_saturn_planet.png"
  },
  {
    id: "ice-planet",
    name: "Ice Planet",
    color: "cyan",
    chance: 5,
    xp: 500,
    image: "/images/planets/ice_crystal_blue_planet.png"
  }
];

interface GameStore {
  wallet: WalletState;
  setWallet: (wallet: Partial<WalletState>) => void;

  user: User | null;
  setUser: (user: User | null) => void;

  selectedPlanet: Planet | null;
  setSelectedPlanet: (planet: Planet | null) => void;

  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;

  currentPrediction: Prediction | null;
  setCurrentPrediction: (prediction: Prediction | null) => void;

  isLaunching: boolean;
  setIsLaunching: (launching: boolean) => void;

  countdown: number;
  setCountdown: (countdown: number) => void;

  showResults: boolean;
  setShowResults: (showResults: boolean) => void;

  lastResult: {
    won: boolean;
    landedPlanet: Planet;
    xpEarned: number;
  } | null;
  setLastResult: (result: { won: boolean; landedPlanet: Planet; xpEarned: number } | null) => void;

  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  wallet: {
    address: undefined,
    isConnected: false,
    isMiniPay: false,
    balance: undefined,
    chainId: undefined,
  },
  setWallet: (wallet) => set((state) => ({ wallet: { ...state.wallet, ...wallet } })),

  user: null,
  setUser: (user) => set({ user }),

  selectedPlanet: null,
  setSelectedPlanet: (selectedPlanet) => set({ selectedPlanet }),

  gameState: {
    currentRound: undefined,
    countdown: undefined,
    rocketPosition: 0,
  },
  setGameState: (gameState) => set((state) => ({ gameState: { ...state.gameState, ...gameState } })),

  currentPrediction: null,
  setCurrentPrediction: (currentPrediction) => set({ currentPrediction }),

  isLaunching: false,
  setIsLaunching: (isLaunching) => set({ isLaunching }),

  countdown: 0,
  setCountdown: (countdown) => set({ countdown }),

  showResults: false,
  setShowResults: (showResults) => set({ showResults }),

  lastResult: null,
  setLastResult: (lastResult) => set({ lastResult }),

  resetGame: () => set({
    selectedPlanet: null,
    currentPrediction: null,
    isLaunching: false,
    countdown: 0,
    showResults: false,
    lastResult: null,
  }),
}));

export function getPlanetById(id: number): Planet | undefined {
  return PLANETS.find((p) => p.id === id);
}

export function getRandomPlanet(): Planet {
  const randomIndex = Math.floor(Math.random() * PLANETS.length);
  return PLANETS[randomIndex];
}

export function getRandomPlanetDeterministic(seed: string): { planet: Planet; seed: string; index: number } {
  try {
    // Simple deterministic hash from seed string
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = ((hash << 5) - hash) + seed.charCodeAt(i);
      hash = hash & hash; // Convert to 32bit integer
    }

    const index = Math.abs(hash) % PLANETS.length;
    const planet = PLANETS[index];

    // Fallback to Earth (id=3) if planet is undefined
    if (!planet) {
      console.error("[RocketMint] Random planet selection failed, defaulting to Earth");
      return {
        planet: getPlanetById(3) || PLANETS[0],
        seed,
        index: 0
      };
    }

    return { planet, seed, index };
  } catch (error) {
    console.error("[RocketMint] Error in random selection, defaulting to Earth:", error);
    return {
      planet: getPlanetById(3) || PLANETS[0],
      seed,
      index: 0
    };
  }
}

export function calculateXP(won: boolean, planet: Planet): number {
  if (!won) return 10;
  return Math.floor(50 * planet.multiplier);
}