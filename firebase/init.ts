
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

let firebaseApp: FirebaseApp | null = null;
let firestoreDb: Firestore | null = null;

export function initializeFirebase() {
  if (getApps().length > 0) {
    firebaseApp = getApps()[0];
    firestoreDb = getFirestore(firebaseApp);
    return { app: firebaseApp, db: firestoreDb };
  }

  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
  };

  // Check if all required env vars are present
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    console.warn(
      `[Firebase] Missing configuration: ${missingVars.join(", ")}. Firebase disabled.`
    );
    return { app: null, db: null };
  }

  try {
    firebaseApp = initializeApp(config);
    firestoreDb = getFirestore(firebaseApp);
    console.log("[Firebase] Initialized successfully");
    return { app: firebaseApp, db: firestoreDb };
  } catch (error) {
    console.error("[Firebase] Initialization failed:", error);
    return { app: null, db: null };
  }
}

export function getFirestoreDb(): Firestore | null {
  if (!firestoreDb) {
    const { db } = initializeFirebase();
    return db;
  }
  return firestoreDb;
}

export { firebaseApp, firestoreDb };
