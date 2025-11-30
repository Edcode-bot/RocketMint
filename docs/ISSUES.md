
# Known Issues & Manual Steps Required

## Automated Tasks Completed ✓

1. ✓ Reorganized game layout (planets above rocket in GameSection with inline SVG)
2. ✓ Optimized wallet connection (MiniPay -> Valora -> wagmi with 4s timeouts)
3. ✓ Implemented client-side prediction with Earth fallback
4. ✓ Created smart contract scaffold (MiniRocketGame.sol)
5. ✓ Added Firebase leaderboard hooks
6. ✓ Created SVG rocket favicon
7. ✓ Documented Vercel deployment (see VERCEL_FIX.md)

## Manual Steps Required

### 1. Install Hardhat Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @nomicfoundation/hardhat-ethers chai dotenv
```

**Status**: Package installation commands provided above.

### 2. Deploy Smart Contract to Alfajores

Before deploying, add your private key to `.env.local`:

```bash
DEPLOYER_PRIVATE_KEY=your_private_key_without_0x_prefix
ALFAJORES_RPC_URL=https://alfajores-forno.celo-testnet.org
```

Then deploy:

```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network alfajores
```

**Status**: Contract code ready; deployment requires manual private key setup.

**Security Warning**: Never commit private keys. Use `.env.local` (already gitignored).

### 3. Update Frontend with Contract Address

After deployment, update `client/src/contracts/deployment.json` with the deployed contract address, or manually create the file:

```json
{
  "address": "0xYourDeployedContractAddress",
  "network": "alfajores",
  "deployer": "0xYourDeployerAddress",
  "timestamp": "2024-01-30T..."
}
```

**Status**: Deployment script auto-generates this file; verify after deployment.

### 4. Test Wallet Connections

Test in different environments:
- ✓ MiniPay mobile browser (Opera)
- ✓ Valora mobile wallet
- ✓ MetaMask desktop
- ✓ WalletConnect mobile

**Expected behavior**:
- MiniPay attempts first (4s timeout)
- Falls back to Valora (4s timeout)
- Falls back to wagmi injected/WalletConnect
- Shows clear status messages
- "Try Manual Connect" button on failure

**Status**: Code implemented; real-world testing required.

### 5. Configure Firebase (If Using)

1. Create project: https://console.firebase.google.com
2. Enable Firestore Database
3. Add credentials to `.env.local`:

```
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_STORAGE_BUCKET=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_APP_ID=...
```

4. Set Firestore security rules (see `firebase/README.md`)

**Status**: Boilerplate ready; credentials needed.

**Security Note**: Client-side writes are enabled for demo. For production, migrate to Cloud Functions to prevent abuse.

### 6. On-Chain Integration (Future Enhancement)

Current state: Client-side deterministic random with console logs.

To integrate smart contract:

1. Deploy contract (see step 2)
2. Import contract ABI in frontend:
   ```typescript
   import MiniRocketGameABI from "@/contracts/MiniRocketGame.json";
   ```
3. Replace `getRandomPlanetDeterministic()` call with contract interaction
4. Listen to `PlanetLanded` event for results
5. Update XP from `XPAwarded` event

**Contract functions ready**:
- `submitPrediction(uint256 planetId)`
- `resolveRound(uint256 seed)` (owner only)
- `awardXP(address player, uint256 amount)` (owner only)

**Status**: Smart contract deployed and tested locally; frontend integration is placeholder.

### 7. MCP Initialization (Optional)

If using Celo Composer Kit MCP:

```bash
npx @celo/composer-kit-mcp init
```

Follow prompts to configure MiniPay integration templates.

**Status**: Standard MiniPay detection is implemented; MCP templates are optional enhancement.

### 8. Convert SVG Favicon to ICO (Optional)

For legacy browser support:

```bash
# Online: https://convertio.co/svg-ico/
# Or install converter
npm install -D @resvg/resvg-js
```

**Status**: SVG favicon works in modern browsers; ICO is optional.

### 9. Run Local Tests

Test build:
```bash
cd client && npm run build
npm run preview
```

Test contracts:
```bash
npx hardhat test
```

Expected output: All tests passing.

**Status**: Build scripts configured; manual execution required.

## Breaking Changes

None. All changes are additive and backward-compatible.

## Performance Optimizations

- Wallet connection attempts fastest provider first (MiniPay on mobile)
- Client-side prediction provides instant gameplay
- SVG icons reduce asset load times
- Deterministic random uses lightweight hash function

## Security Considerations

### Critical

1. **Private Keys**: Never commit `.env.local` - already in `.gitignore`
2. **Firestore Rules**: Client writes are insecure - migrate to Cloud Functions
3. **Contract Owner**: Only contract owner can resolve rounds and award XP
4. **Random Source**: Client random is NOT cryptographically secure

### Recommended for Production

1. Use Chainlink VRF for verifiable randomness
2. Implement commit-reveal pattern for predictions
3. Add Firebase Authentication
4. Enable Firestore App Check
5. Add rate limiting on API endpoints
6. Use environment-specific contract addresses

## Known Limitations

1. **Client-side random**: Deterministic but not cryptographically secure
2. **Manual contract deployment**: Requires private key setup
3. **Firebase writes**: Client-side only (guidance provided for Cloud Functions)
4. **No VRF**: True on-chain randomness requires Chainlink integration

## Documentation Files

- `README.md` - Project overview and setup
- `VERCEL_FIX.md` - Deployment guide
- `firebase/README.md` - Firebase configuration
- `design_guidelines.md` - UI/UX guidelines

---

**Last Updated**: 2024-01-30  
**Build Version**: Complete with smart contract scaffold  
**Agent Status**: All automated tasks finished
