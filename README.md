
# 🚀 RocketMint

A mobile-first blockchain prediction game built on Celo's Alfajores testnet with MiniPay integration.

![RocketMint Banner](./attached_assets/generated_images/futuristic_celo-green_rocket_ship.png)

## 🎮 What is RocketMint?

RocketMint is a fast-paced prediction game where players:
1. Connect their MiniPay/Valora/Web3 wallet
2. Select a planet destination
3. Launch a rocket
4. Earn XP if their prediction is correct!

## ✨ Features

- **Mobile-First Design** - Optimized for MiniPay browser
- **MiniPay MCP Integration** - Seamless Celo wallet connection
- **On-Chain Predictions** - Smart contract records stored on Celo Alfajores
- **Real-Time Gameplay** - Instant rocket animations and results
- **Leaderboard System** - Compete with other players
- **Badge Rewards** - Unlock achievements as you play

## 🛠 Tech Stack

### Frontend
- React 18 + TypeScript
- Vite 5
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Framer Motion (animations)

### Blockchain
- Celo Alfajores Testnet
- viem 2.x (wallet integration)
- Hardhat (smart contract deployment)
- MiniPay MCP

### Backend
- Express.js
- PostgreSQL + Drizzle ORM
- Firebase Firestore (optional leaderboard)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MiniPay browser (or Valora/MetaMask)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Run development server
npm run dev
```

App runs on http://0.0.0.0:5000

### Deploy Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Alfajores
npm run deploy:contract
```

## 📱 Mobile Testing

### Using MiniPay
1. Open Opera Mini browser with MiniPay
2. Navigate to your Replit deployment URL
3. Wallet will auto-connect

### Using Valora
1. Open Valora wallet app
2. Use in-app browser
3. Connect wallet when prompted

## 🏗 Project Structure

```
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── lib/         # Utilities & stores
│   │   ├── pages/       # App pages
│   │   └── contracts/   # ABI & deployment info
├── contracts/           # Solidity smart contracts
├── scripts/             # Deployment scripts
├── server/              # Express backend
└── docs/                # Documentation
```

## 🎯 Game Mechanics

### Planets & Rewards
- **Earth** (50% chance) - 50 XP
- **Mars** (30% chance) - 100 XP
- **Saturn** (15% chance) - 200 XP
- **Ice Planet** (5% chance) - 500 XP

### Streak Bonuses
- 3+ correct: +10% XP
- 5+ correct: +25% XP
- 10+ correct: +50% XP

## 🔒 Security Notes

⚠️ **Development Mode**: Client-side randomness (NOT production-ready)

✅ **For Production**:
- Use Chainlink VRF for verifiable randomness
- Implement commit-reveal pattern
- Add proper authentication
- Enable rate limiting

## 📄 Smart Contract

**Network**: Celo Alfajores Testnet  
**Contract**: MiniRocketGame.sol  
**Address**: See `client/src/contracts/deployment.json`

### Key Functions
- `submitPrediction(uint256 planetId)` - Record player prediction
- `resolveRound(uint256 seed)` - Determine landing planet (owner only)
- `awardXP(address player, uint256 amount)` - Grant XP rewards (owner only)

## 🌐 Deployment

### Replit Deployment
1. Click **Deploy** button
2. Select **Autoscale**
3. Configure environment variables
4. Deploy!

### Manual Build
```bash
npm run build
npm start
```

## 📚 Documentation

- [Architecture Guide](./docs/README.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Known Issues](./docs/ISSUES.md)
- [Demo Script](./docs/demo_script.md)

## 🤝 Contributing

This is a hackathon project. For bugs or suggestions, open an issue!

## 📜 License

MIT License - feel free to use this code for your own projects.

## 🙏 Acknowledgments

Built with:
- [Celo](https://celo.org)
- [MiniPay](https://www.opera.com/products/minipay)
- [Replit](https://replit.com)
- [shadcn/ui](https://ui.shadcn.com)

---

Made with 💚 for the Celo ecosystem
