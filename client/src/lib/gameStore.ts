import { create } from "zustand";
import type { WalletState, Planet, GameState, User, Prediction } from "@shared/schema";
import { PLANETS } from "@shared/schema";

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
  setShowResults: (show: boolean) => void;
  
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
  // Simple hash function for deterministic pseudo-randomness
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const absHash = Math.abs(hash);
  const index = absHash % PLANETS.length;
  
  console.log(`[RocketMint] Deterministic Selection:`, {
    seed,
    hash: absHash,
    selectedIndex: index,
    selectedPlanet: PLANETS[index].name,
    allPlanets: PLANETS.map(p => p.name)
  });
  
  return {
    planet: PLANETS[index],
    seed,
    index
  };
}

export function calculateXP(won: boolean, planet: Planet): number {
  if (!won) return 10;
  return Math.floor(50 * planet.multiplier);
}
