import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { PLANETS } from "@shared/schema";
import { randomUUID } from "crypto";

const predictionRequestSchema = z.object({
  walletAddress: z.string().min(1),
  planetId: z.number().int().min(1).max(PLANETS.length),
});

const userUpdateSchema = z.object({
  username: z.string().min(1).max(20).optional(),
  xp: z.number().int().min(0).optional(),
  totalPredictions: z.number().int().min(0).optional(),
  correctPredictions: z.number().int().min(0).optional(),
  currentStreak: z.number().int().min(0).optional(),
  bestStreak: z.number().int().min(0).optional(),
  badges: z.array(z.string()).optional(),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/users/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      let user = await storage.getUser(walletAddress);
      
      if (!user) {
        user = await storage.createUser({
          walletAddress,
          xp: 0,
          totalPredictions: 0,
          correctPredictions: 0,
          currentStreak: 0,
          bestStreak: 0,
          badges: [],
        });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  app.patch("/api/users/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const result = userUpdateSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error.issues });
      }
      
      let user = await storage.getUser(walletAddress);
      if (!user) {
        user = await storage.createUser({
          walletAddress,
          ...result.data,
          xp: result.data.xp ?? 0,
          totalPredictions: result.data.totalPredictions ?? 0,
          correctPredictions: result.data.correctPredictions ?? 0,
          currentStreak: result.data.currentStreak ?? 0,
          bestStreak: result.data.bestStreak ?? 0,
          badges: result.data.badges ?? [],
        });
      } else {
        user = await storage.updateUser(walletAddress, result.data);
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.post("/api/predictions", async (req, res) => {
    try {
      const result = predictionRequestSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid request body", details: result.error.issues });
      }
      
      const { walletAddress, planetId } = result.data;
      
      let user = await storage.getUser(walletAddress);
      if (!user) {
        user = await storage.createUser({
          walletAddress,
          xp: 0,
          totalPredictions: 0,
          correctPredictions: 0,
          currentStreak: 0,
          bestStreak: 0,
          badges: [],
        });
      }
      
      let round = await storage.getCurrentRound();
      if (!round || round.status === "resolved") {
        round = await storage.createRound({
          startTime: Date.now(),
          status: "waiting",
          totalPredictions: 0,
        });
      }
      
      const prediction = await storage.createPrediction({
        roundId: round.id,
        walletAddress,
        planetId,
        timestamp: Date.now(),
      });
      
      await storage.updateRound(round.id, {
        totalPredictions: round.totalPredictions + 1,
      });
      
      res.status(201).json(prediction);
    } catch (error) {
      console.error("Error creating prediction:", error);
      res.status(500).json({ error: "Failed to create prediction" });
    }
  });

  app.get("/api/predictions/:walletAddress", async (req, res) => {
    try {
      const { walletAddress } = req.params;
      const predictions = await storage.getPredictionsByWallet(walletAddress);
      res.json(predictions);
    } catch (error) {
      console.error("Error getting predictions:", error);
      res.status(500).json({ error: "Failed to get predictions" });
    }
  });

  app.post("/api/rounds/resolve", async (req, res) => {
    try {
      const round = await storage.getCurrentRound();
      if (!round) {
        return res.status(404).json({ error: "No active round" });
      }
      
      const landedPlanetId = Math.floor(Math.random() * PLANETS.length) + 1;
      
      const updatedRound = await storage.updateRound(round.id, {
        status: "resolved",
        endTime: Date.now(),
        landedPlanetId,
      });
      
      res.json(updatedRound);
    } catch (error) {
      console.error("Error resolving round:", error);
      res.status(500).json({ error: "Failed to resolve round" });
    }
  });

  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error getting leaderboard:", error);
      res.status(500).json({ error: "Failed to get leaderboard" });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  return httpServer;
}
