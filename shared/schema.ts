import { z } from "zod";

export const PLANETS = [
  { id: 1, name: "Mars", color: "#E74C3C", multiplier: 2 },
  { id: 2, name: "Terra", color: "#3498DB", multiplier: 1.5 },
  { id: 3, name: "Saturn", color: "#F39C12", multiplier: 3 },
  { id: 4, name: "Nebula", color: "#9B59B6", multiplier: 4 },
  { id: 5, name: "Frost", color: "#1ABC9C", multiplier: 2.5 },
] as const;

export type Planet = (typeof PLANETS)[number];

export const userSchema = z.object({
  id: z.string(),
  walletAddress: z.string(),
  username: z.string().optional(),
  xp: z.number().default(0),
  totalPredictions: z.number().default(0),
  correctPredictions: z.number().default(0),
  currentStreak: z.number().default(0),
  bestStreak: z.number().default(0),
  badges: z.array(z.string()).default([]),
  createdAt: z.number(),
});

export type User = z.infer<typeof userSchema>;

export const insertUserSchema = userSchema.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;

export const predictionSchema = z.object({
  id: z.string(),
  roundId: z.string(),
  walletAddress: z.string(),
  planetId: z.number(),
  timestamp: z.number(),
  resolved: z.boolean().default(false),
  won: z.boolean().optional(),
  xpEarned: z.number().optional(),
});

export type Prediction = z.infer<typeof predictionSchema>;

export const insertPredictionSchema = predictionSchema.omit({
  id: true,
  resolved: true,
  won: true,
  xpEarned: true,
});
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

export const roundSchema = z.object({
  id: z.string(),
  startTime: z.number(),
  endTime: z.number().optional(),
  status: z.enum(["waiting", "countdown", "launching", "flying", "landed", "resolved"]),
  landedPlanetId: z.number().optional(),
  totalPredictions: z.number().default(0),
});

export type Round = z.infer<typeof roundSchema>;

export const insertRoundSchema = roundSchema.omit({ id: true });
export type InsertRound = z.infer<typeof insertRoundSchema>;

export const leaderboardEntrySchema = z.object({
  rank: z.number(),
  walletAddress: z.string(),
  username: z.string().optional(),
  xp: z.number(),
  totalPredictions: z.number(),
  winRate: z.number(),
  badges: z.array(z.string()),
});

export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;

export const badgeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  requirement: z.string(),
});

export type Badge = z.infer<typeof badgeSchema>;

export const BADGES: Badge[] = [
  { id: "first_prediction", name: "First Launch", description: "Made your first prediction", icon: "rocket", requirement: "1 prediction" },
  { id: "winning_streak_3", name: "Hot Streak", description: "Won 3 predictions in a row", icon: "flame", requirement: "3 win streak" },
  { id: "winning_streak_5", name: "On Fire", description: "Won 5 predictions in a row", icon: "fire", requirement: "5 win streak" },
  { id: "predictions_10", name: "Explorer", description: "Made 10 predictions", icon: "compass", requirement: "10 predictions" },
  { id: "predictions_50", name: "Voyager", description: "Made 50 predictions", icon: "telescope", requirement: "50 predictions" },
  { id: "xp_1000", name: "Rising Star", description: "Earned 1000 XP", icon: "star", requirement: "1000 XP" },
  { id: "xp_5000", name: "Cosmic Legend", description: "Earned 5000 XP", icon: "crown", requirement: "5000 XP" },
];

export const gameStateSchema = z.object({
  currentRound: roundSchema.optional(),
  countdown: z.number().optional(),
  rocketPosition: z.number().default(0),
});

export type GameState = z.infer<typeof gameStateSchema>;

export const walletStateSchema = z.object({
  address: z.string().optional(),
  isConnected: z.boolean().default(false),
  isMiniPay: z.boolean().default(false),
  balance: z.string().optional(),
  chainId: z.number().optional(),
});

export type WalletState = z.infer<typeof walletStateSchema>;
