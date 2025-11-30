
# RocketMint Demo Script (4 Minutes)

## Intro (30 seconds)

"Hi! I'm excited to show you RocketMint - a mobile-first prediction game built on Celo's Alfajores testnet. It demonstrates MiniPay wallet integration and fun blockchain gaming mechanics."

**Show**: Landing page with animated starfield and rocket

## Wallet Connection (45 seconds)

"First, let's connect a wallet. RocketMint intelligently detects your environment:"

1. On MiniPay: Auto-connects in ~2 seconds
2. On desktop: Shows MetaMask or WalletConnect options
3. Fallback: Manual connect button if timeouts occur

**Show**: 
- Connect wallet button
- Connection status messages ("trying minipay", "connected")
- Wallet card showing address, cUSD balance, network badge

**Say**: "Notice the smart fallback - if MiniPay times out after 4 seconds, it automatically tries Valora, then falls back to standard wagmi providers."

## Gameplay (90 seconds)

"Now let's play! The game is simple but engaging:"

1. **Select Planet** (10s)
   - "I'll choose Terra (Earth) - each planet has different XP multipliers"
   - Show planet carousel with SVG icons
   - Highlight selected planet with Celo-green ring

2. **Launch Rocket** (30s)
   - Click "Launch Rocket" button
   - "Watch the 3-second countdown"
   - Show rocket shake animation
   - Show rocket flying upward
   - "The game uses deterministic client-side randomness for instant results"

3. **View Results** (50s)
   - Show results modal with:
     - Win/loss status
     - Landed planet
     - XP earned
     - Updated total XP
   - "I won 50 XP! The multiplier varies by planet rarity"
   - Show console logs with random seed and result

**Say**: "Notice the smooth animations and immediate feedback - no waiting for blockchain confirmation during gameplay. This is perfect for mobile users."

## Technical Highlights (60 seconds)

"Let me show you what's under the hood:"

1. **Smart Contract** (20s)
   ```
   Show: contracts/MiniRocketGame.sol
   ```
   - Events: `PredictionSubmitted`, `PlanetLanded`, `XPAwarded`
   - Functions: `submitPrediction()`, `resolveRound()`
   - "Ready for on-chain integration with hooks already in place"

2. **Wallet Priority System** (20s)
   ```
   Show: client/src/lib/wallet.ts
   ```
   - MiniPay → Valora → wagmi fallback
   - 4-second timeouts for mobile optimization
   - "This ensures the fastest connection for each environment"

3. **State Management** (20s)
   ```
   Show: client/src/lib/gameStore.ts
   ```
   - Zustand for lightweight state
   - Deterministic random with Earth fallback
   - "If random selection fails, it defaults to Earth - no crashes"

## Leaderboard & Firebase (30 seconds)

"The game tracks stats and leaderboard:"

**Show**:
- Navigate to Leaderboard page
- Show top players with XP, win rates, badges
- Explain Firebase integration (optional)

**Say**: "Results are saved to Firestore. For production, we'd migrate writes to Cloud Functions for security."

## Deployment & Next Steps (25 seconds)

"Deployment is straightforward:"

- Vercel: `vercel --prod` (see VERCEL_FIX.md)
- Replit: One-click deploy
- Hardhat: `npx hardhat run scripts/deploy.js --network alfajores`

**Show**: Quick glimpse of `docs/VERCEL_FIX.md`

**Say**: "All deployment steps are documented. The contract can be deployed to Alfajores with a single command."

## Closing (10 seconds)

"RocketMint demonstrates best practices for Celo dApps:"
- ✓ Mobile-first design
- ✓ MiniPay optimization
- ✓ Instant UX with blockchain hooks
- ✓ Smart contract scaffold ready

"Thanks for watching! Try it yourself at [your-deployment-url]"

---

## Demo Notes

### Preparation Checklist
- [ ] Wallet funded with testnet CELO/cUSD
- [ ] Environment variables configured
- [ ] App running on localhost or deployed
- [ ] Browser console open for technical viewers
- [ ] Screen recording software ready

### Fallback Plan
If wallet connection fails:
- Show manual "Try wagmi" button
- Explain timeout behavior
- Proceed with demo using test account

### Key Messages
1. **Mobile-first**: Everything optimized for MiniPay
2. **Smart fallbacks**: No user frustration
3. **Production-ready**: Contract + deployment docs included
4. **Developer-friendly**: Clear architecture, documented code

### Timing Breakdown
- Intro: 0:00-0:30
- Wallet: 0:30-1:15
- Gameplay: 1:15-2:45
- Technical: 2:45-3:45
- Closing: 3:45-4:00

Total: 4:00 minutes
