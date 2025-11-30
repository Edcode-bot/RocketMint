
import { getFirestoreDb } from "../../../firebase/init";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

export interface LeaderboardEntry {
  walletAddress: string;
  username?: string;
  xp: number;
  totalPredictions: number;
  correctPredictions: number;
  timestamp: number;
}

export async function saveGameResult(entry: LeaderboardEntry): Promise<void> {
  const db = getFirestoreDb();
  if (!db) {
    console.warn("[Firestore] Database not initialized, skipping save");
    return;
  }

  try {
    await addDoc(collection(db, "leaderboard"), {
      ...entry,
      timestamp: Date.now()
    });
    console.log("[Firestore] Game result saved successfully");
  } catch (error) {
    console.error("[Firestore] Failed to save game result:", error);
  }
}

export async function getTopPlayers(limitCount: number = 10): Promise<LeaderboardEntry[]> {
  const db = getFirestoreDb();
  if (!db) {
    console.warn("[Firestore] Database not initialized");
    return [];
  }

  try {
    const q = query(
      collection(db, "leaderboard"),
      orderBy("xp", "desc"),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const results: LeaderboardEntry[] = [];
    
    querySnapshot.forEach((doc) => {
      results.push(doc.data() as LeaderboardEntry);
    });
    
    return results;
  } catch (error) {
    console.error("[Firestore] Failed to fetch leaderboard:", error);
    return [];
  }
}
