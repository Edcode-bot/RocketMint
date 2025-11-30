
# RocketMint Documentation

## Overview

RocketMint is a mobile-first blockchain prediction game built on Celo's Alfajores testnet. Players predict which planet a rocket will land on and earn XP rewards for correct predictions.

## Architecture

### Frontend
- **Framework**: React + TypeScript with Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **State**: Zustand for lightweight state management
- **Wallet**: MiniPay-first with Valora and wagmi fallbacks
- **Animation**: Inline SVG with CSS transforms

### Backend
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Firebase Firestore (optional)

### Blockchain
- **Network**: Celo Alfajores Testnet (Chain ID: 44787)
- **Contract**: MiniRocketGame.sol (Solidity 0.8.20)
- **Tools**: Hardhat for deployment and testing
- **Libraries**: viem, @celo/contractkit

## Key Features

### 1. Intelligent Wallet Connection
- Priority detection: MiniPay → Valora → wagmi
- 4-second timeout per provider
- Visible status messages
- Manual fallback button

### 2. Instant Gameplay
- Client-side deterministic randomness
- 3-second countdown
- Smooth rocket animations with inline SVG
- Immediate result feedback

### 3. Smart Contract Integration Hooks
- `submitPrediction(uint256 planetId)`
- `resolveRound(uint256 seed)` 
- `awardXP(address player, uint256 amount)`
- Event listeners ready: `PredictionSubmitted`, `PlanetLanded`, `XPAwarded`

### 4. Leaderboard System
- Firebase Firestore for persistent storage
- Client-side writes (migrate to Cloud Functions for production)
- Real-time ranking updates

## File Structure

```
├── client/                    # Frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── game/        # Game-specific components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── lib/             # Utilities and stores
│   │   ├── pages/           # Route pages
│   │   └── contracts/       # Contract ABIs
│   └── public/              # Static assets
├── contracts/                # Smart contracts
│   └── MiniRocketGame.sol
├── scripts/                  # Deployment scripts
│   └── deploy.js
├── test/                     # Contract tests
│   └── minirocket.test.js
├── firebase/                 # Firebase config
│   ├── init.ts
│   └── README.md
├── server/                   # Express backend
└── docs/                     # Documentation
    ├── README.md            # This file
    ├── ISSUES.md            # Manual steps
    ├── VERCEL_FIX.md        # Deployment guide
    └── demo_script.md       # 4-minute demo
```

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
# Firebase (optional)
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_domain
FIREBASE_PROJECT_ID=your_project_id

# Hardhat (for contract deployment)
DEPLOYER_PRIVATE_KEY=your_private_key
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
```

### 3. Run Development Server

```bash
npm run dev
```

App runs on http://localhost:5000

### 4. Deploy Smart Contract

```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network alfajores
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel
See [VERCEL_FIX.md](./VERCEL_FIX.md) for detailed steps.

```bash
vercel --prod
```

### Replit
Click "Deploy" button → Select deployment type → Configure env vars

## Testing

### Frontend
```bash
npm run dev
# Open localhost:5000 and test wallet connections
```

### Smart Contract
```bash
npx hardhat test
```

Expected: All tests passing

### Integration
1. Connect wallet (MiniPay/Valora/MetaMask)
2. Select planet
3. Launch rocket
4. Verify result and XP update
5. Check console logs for random seed

## Documentation

- **Architecture**: This file
- **Manual Steps**: [ISSUES.md](./ISSUES.md)
- **Deployment**: [VERCEL_FIX.md](./VERCEL_FIX.md)
- **Firebase**: [../firebase/README.md](../firebase/README.md)
- **Demo Script**: [demo_script.md](./demo_script.md)
- **Design Guidelines**: [../design_guidelines.md](../design_guidelines.md)

## Tech Stack

### Frontend
- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- shadcn/ui
- Zustand
- React Query
- Wouter (routing)

### Blockchain
- viem 2.x
- @celo/contractkit
- Hardhat 2.x
- ethers.js 6.x

### Backend
- Express.js
- PostgreSQL
- Drizzle ORM
- Firebase Firestore

## Security Notes

⚠️ **Development Mode**: Client-side randomness is NOT cryptographically secure

✅ **Production Requirements**:
1. Use Chainlink VRF for verifiable randomness
2. Implement commit-reveal pattern
3. Migrate Firestore writes to Cloud Functions
4. Add Firebase Authentication
5. Enable rate limiting
6. Use environment-specific contract addresses

## Support

For issues or questions:
1. Check [ISSUES.md](./ISSUES.md) for known limitations
2. Review console logs for debug information
3. Test wallet connection with different providers
4. Verify environment variables are set

## License

MIT

---

**Last Updated**: 2024-01-30  
**Version**: 1.0.0  
**Status**: Production-ready with manual deployment steps
