import { randomUUID } from "crypto";
import type { 
  User, 
  InsertUser, 
  Prediction, 
  InsertPrediction,
  Round,
  InsertRound,
  LeaderboardEntry,
} from "@shared/schema";

export interface IStorage {
  getUser(walletAddress: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(walletAddress: string, updates: Partial<User>): Promise<User | undefined>;
  
  getPrediction(id: string): Promise<Prediction | undefined>;
  getPredictionsByWallet(walletAddress: string): Promise<Prediction[]>;
  createPrediction(prediction: InsertPrediction): Promise<Prediction>;
  updatePrediction(id: string, updates: Partial<Prediction>): Promise<Prediction | undefined>;
  
  getCurrentRound(): Promise<Round | undefined>;
  createRound(round: InsertRound): Promise<Round>;
  updateRound(id: string, updates: Partial<Round>): Promise<Round | undefined>;
  
  getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private predictions: Map<string, Prediction>;
  private rounds: Map<string, Round>;
  private currentRoundId: string | null;

  constructor() {
    this.users = new Map();
    this.predictions = new Map();
    this.rounds = new Map();
    this.currentRoundId = null;
    
    this.seedData();
  }

  private seedData() {
    const sampleUsers: User[] = [
      { id: "1", walletAddress: "0x1234567890abcdef1234567890abcdef12345678", username: "CryptoKing", xp: 15420, totalPredictions: 234, correctPredictions: 159, currentStreak: 5, bestStreak: 12, badges: ["first_prediction", "winning_streak_5", "xp_5000"], createdAt: Date.now() - 86400000 * 30 },
      { id: "2", walletAddress: "0x2345678901abcdef2345678901abcdef23456789", username: "MoonHunter", xp: 12350, totalPredictions: 189, correctPredictions: 117, currentStreak: 3, bestStreak: 8, badges: ["first_prediction", "winning_streak_3", "xp_1000"], createdAt: Date.now() - 86400000 * 25 },
      { id: "3", walletAddress: "0x3456789012abcdef3456789012abcdef34567890", username: "StarGazer", xp: 10890, totalPredictions: 156, correctPredictions: 90, currentStreak: 0, bestStreak: 6, badges: ["first_prediction", "predictions_50", "xp_1000"], createdAt: Date.now() - 86400000 * 20 },
      { id: "4", walletAddress: "0x4567890123abcdef4567890123abcdef45678901", xp: 8760, totalPredictions: 134, correctPredictions: 74, currentStreak: 2, bestStreak: 5, badges: ["first_prediction", "predictions_10"], createdAt: Date.now() - 86400000 * 15 },
      { id: "5", walletAddress: "0x5678901234abcdef5678901234abcdef56789012", username: "RocketRider", xp: 7650, totalPredictions: 112, correctPredictions: 58, currentStreak: 1, bestStreak: 4, badges: ["first_prediction"], createdAt: Date.now() - 86400000 * 10 },
    ];

    sampleUsers.forEach(user => {
      this.users.set(user.walletAddress, user);
    });
  }

  async getUser(walletAddress: string): Promise<User | undefined> {
    return this.users.get(walletAddress);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      walletAddress: insertUser.walletAddress,
      username: insertUser.username,
      xp: insertUser.xp ?? 0,
      totalPredictions: insertUser.totalPredictions ?? 0,
      correctPredictions: insertUser.correctPredictions ?? 0,
      currentStreak: insertUser.currentStreak ?? 0,
      bestStreak: insertUser.bestStreak ?? 0,
      badges: insertUser.badges ?? [],
      createdAt: Date.now(),
    };
    this.users.set(user.walletAddress, user);
    return user;
  }

  async updateUser(walletAddress: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(walletAddress);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(walletAddress, updatedUser);
    return updatedUser;
  }

  async getPrediction(id: string): Promise<Prediction | undefined> {
    return this.predictions.get(id);
  }

  async getPredictionsByWallet(walletAddress: string): Promise<Prediction[]> {
    return Array.from(this.predictions.values())
      .filter(p => p.walletAddress === walletAddress)
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  async createPrediction(insertPrediction: InsertPrediction): Promise<Prediction> {
    const id = randomUUID();
    const prediction: Prediction = {
      id,
      roundId: insertPrediction.roundId,
      walletAddress: insertPrediction.walletAddress,
      planetId: insertPrediction.planetId,
      timestamp: insertPrediction.timestamp,
      resolved: false,
    };
    this.predictions.set(id, prediction);
    return prediction;
  }

  async updatePrediction(id: string, updates: Partial<Prediction>): Promise<Prediction | undefined> {
    const prediction = this.predictions.get(id);
    if (!prediction) return undefined;
    
    const updatedPrediction = { ...prediction, ...updates };
    this.predictions.set(id, updatedPrediction);
    return updatedPrediction;
  }

  async getCurrentRound(): Promise<Round | undefined> {
    if (!this.currentRoundId) return undefined;
    return this.rounds.get(this.currentRoundId);
  }

  async createRound(insertRound: InsertRound): Promise<Round> {
    const id = randomUUID();
    const round: Round = {
      id,
      startTime: insertRound.startTime,
      endTime: insertRound.endTime,
      status: insertRound.status,
      landedPlanetId: insertRound.landedPlanetId,
      totalPredictions: insertRound.totalPredictions ?? 0,
    };
    this.rounds.set(id, round);
    this.currentRoundId = id;
    return round;
  }

  async updateRound(id: string, updates: Partial<Round>): Promise<Round | undefined> {
    const round = this.rounds.get(id);
    if (!round) return undefined;
    
    const updatedRound = { ...round, ...updates };
    this.rounds.set(id, updatedRound);
    return updatedRound;
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const users = Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);

    return users.map((user, index) => ({
      rank: index + 1,
      walletAddress: user.walletAddress,
      username: user.username,
      xp: user.xp,
      totalPredictions: user.totalPredictions,
      winRate: user.totalPredictions > 0 
        ? Math.round((user.correctPredictions / user.totalPredictions) * 100) 
        : 0,
      badges: user.badges,
    }));
  }
}

export const storage = new MemStorage();
