
# Firebase Setup for RocketMint

## Installation

Firebase SDK should be installed. If not, run:

```bash
npm install firebase
```

## Configuration

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Copy your Firebase configuration
4. Create `.env.local` in the project root:

```env
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
```

## Firestore Security Rules

In Firebase Console > Firestore Database > Rules, use these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Predictions collection
    match /predictions/{predictionId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if false;
    }
    
    // Leaderboard collection (read-only for clients)
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if false;
    }
  }
}
```

## Usage

```typescript
import { getFirestoreDb } from '@/firebase/init';
import { collection, addDoc } from 'firebase/firestore';

const db = getFirestoreDb();
if (db) {
  await addDoc(collection(db, 'predictions'), {
    walletAddress: '0x...',
    planetId: 1,
    timestamp: Date.now()
  });
}
```

## Security Notes

- Never commit `.env.local` to git
- Use Firestore security rules to protect data
- Consider Firebase Authentication for production
- Enable App Check for additional security
