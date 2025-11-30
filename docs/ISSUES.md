
# Known Issues & Manual Steps Required

## Automated Tasks Completed ✓

1. ✓ Reorganized game layout (planets above rocket in GameSection)
2. ✓ Optimized wallet connection with MiniPay detection and timeout handling
3. ✓ Implemented client-side prediction flow with deterministic randomness
4. ✓ Added Firebase boilerplate with Firestore integration
5. ✓ Created SVG rocket favicon
6. ✓ Documented Vercel deployment configuration

## Manual Steps Required

### 1. Install Firebase Package

The Firebase SDK needs to be installed:

```bash
npm install firebase
```

**Status:** Package reference added to code but not installed automatically.

### 2. Convert SVG Favicon to ICO (Optional)

For broader browser support, convert the SVG favicon:

- Online tool: https://convertio.co/svg-ico/
- Or use build tool: `npm install -D @svgr/cli` and configure build script
- Place result in `client/public/favicon.ico`

**Status:** SVG favicon created; ICO conversion is optional for production.

### 3. Configure Firebase (If Using)

1. Create Firebase project at https://console.firebase.google.com
2. Copy credentials to `.env.local` (see `.env.example`)
3. Set up Firestore security rules (see `firebase/README.md`)
4. Uncomment Firebase imports in relevant components if needed

**Status:** Boilerplate ready; credentials must be added manually.

### 4. Test Wallet Connection Flow

Test the optimized wallet connection in different environments:

- MiniPay browser (Opera mobile)
- Standard MetaMask desktop
- WalletConnect mobile
- Verify timeout behavior (>5s fallback)

**Status:** Code implemented; real-world testing required.

### 5. On-Chain Integration (Future)

Client-side prediction flow is ready. To integrate smart contracts:

1. Deploy prediction contract to Celo Alfajores
2. Replace deterministic random selection with contract call
3. Listen to `PredictionResolved` events
4. Update `handleLaunch` in `Home.tsx` with contract interaction

**Console logs prepared:** Check browser console for integration hook points.

**Status:** Client flow complete; blockchain integration is placeholder.

## Breaking Changes

None. All changes are additive and backward-compatible.

## Performance Notes

- Wallet connection attempts MiniPay first (faster for mobile users)
- Client-side prediction provides instant feedback
- Game is playable immediately without backend dependency

## Security Considerations

- Deterministic randomness is **not cryptographically secure**
- For production, use VRF (Chainlink) or commit-reveal pattern
- Firebase rules must be configured before production use
- Never commit `.env.local` with real credentials

---

**Last Updated:** 2024-01-30  
**Agent Build Version:** Priority Tasks 1-8
