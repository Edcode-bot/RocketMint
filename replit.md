# RocketMint - Celo Prediction Game

## Overview

RocketMint is a mobile-first prediction game built on the Celo blockchain (Alfajores testnet). Players predict which planet a rocket will land on, earn XP rewards for correct predictions, and compete on a leaderboard. The application integrates with MiniPay wallet and follows a space-gaming aesthetic with Celo-green accents.

**Core Mechanics:**
- Players select a planet prediction from 5 options (Mars, Terra, Saturn, Nebula, Frost)
- Rocket launches with visual animation
- Results determine XP rewards based on planet multipliers
- Streak tracking and badge system for achievements
- Real-time leaderboard rankings

**Technology Stack:**
- Frontend: React + TypeScript with Vite
- Backend: Express.js server
- Styling: Tailwind CSS + shadcn/ui component library
- State Management: Zustand
- Database: PostgreSQL with Drizzle ORM
- Blockchain: Celo Alfajores testnet via Viem
- Wallet: MiniPay integration with WalletConnect fallback

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Component Structure:**
- **Pages:** Home (game interface), Leaderboard, Profile, Wallet, About
- **Game Components:** RocketAnimation, PlanetCarousel, WalletConnect, CountdownOverlay, ResultsModal, XPDisplay, BadgeDisplay
- **UI Components:** shadcn/ui library (buttons, cards, dialogs, badges, etc.)
- **Layout:** Fixed bottom navigation for mobile-first experience

**State Management:**
- Zustand store (`gameStore.ts`) manages:
  - Wallet connection state (address, balance, chain)
  - User profile (XP, predictions, streaks, badges)
  - Game state (selected planet, launch status, results)
  - Current prediction and round data
- React Query for server data fetching and caching

**Routing:**
- Wouter for client-side routing
- Routes: `/`, `/leaderboard`, `/profile`, `/wallet`, `/about`

**Design System:**
- Dark space theme with cosmic colors (#0A0E27, #121633, #1A1F3A)
- Celo-green (#35D07F) as primary accent color
- Typography: Inter for UI text, Space Grotesk for numbers
- Mobile-first responsive design with Tailwind breakpoints
- Custom animations for rocket launch, countdown, star fields

### Backend Architecture

**Server Framework:**
- Express.js with TypeScript
- HTTP server (no WebSocket implementation in current code)
- JSON API endpoints under `/api` prefix
- Static file serving for production builds

**API Endpoints:**
- `GET /api/users/:walletAddress` - Fetch or create user profile
- `POST /api/predictions` - Submit prediction for current round
- Additional endpoints implied but not fully implemented in shown code

**Data Storage:**
- In-memory storage implementation (`MemStorage` class) for development
- Drizzle ORM configured for PostgreSQL production database
- Schema includes: users, predictions, rounds, leaderboard entries

**Data Models:**
- **User:** walletAddress, username, xp, prediction stats, streaks, badges
- **Prediction:** roundId, walletAddress, planetId, resolved status, xp earned
- **Round:** start/end timestamps, winning planet
- **Planet:** Fixed configuration with multipliers (2x to 4x)

### Database Schema

**Drizzle Configuration:**
- PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Migrations directory: `./migrations`
- Environment variable: `DATABASE_URL`

**Core Tables (defined via Zod schemas):**
- Users table with wallet authentication
- Predictions linked to rounds and users
- Leaderboard computed from user statistics
- Badge achievement tracking

**Seeded Data:**
- 5 predefined planets with unique colors and multipliers
- Sample leaderboard entries for development
- Badge definitions for milestones (first prediction, streaks, XP thresholds)

### Wallet Integration

**Celo Blockchain:**
- Network: Celo Alfajores Testnet (chainId: 44787)
- RPC: https://alfajores-forno.celo-testnet.org
- Explorer: https://alfajores.celoscan.io

**Wallet Connection:**
- Primary: MiniPay wallet detection via `window.ethereum.isMiniPay`
- Fallback: Standard Web3 wallet via WalletConnect
- Viem library for blockchain interactions
- Automatic network switching to Alfajores

**Token Support:**
- Native CELO token balance tracking
- cUSD stablecoin support (address: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1)
- Balance display and refresh functionality

### Build System

**Development:**
- Vite dev server with HMR
- TypeScript compilation with path aliases (@/, @shared/, @assets/)
- ESM module format

**Production:**
- Client: Vite build to `dist/public`
- Server: esbuild bundling to `dist/index.cjs`
- Selected dependencies bundled to reduce cold start times
- Static asset serving from build directory

**Path Aliases:**
- `@/` → `client/src/`
- `@shared/` → `shared/`
- `@assets/` → `attached_assets/`

## External Dependencies

### Blockchain Services
- **Celo Alfajores Testnet:** Test network for development and deployment
- **Viem:** Ethereum library for wallet interactions and blockchain queries
- **@neondatabase/serverless:** PostgreSQL database adapter

### UI Framework
- **React 18:** Component library with hooks
- **shadcn/ui:** Pre-built component system with Radix UI primitives
- **Tailwind CSS:** Utility-first styling framework
- **Lucide React:** Icon library

### State & Data
- **Zustand:** Lightweight state management
- **TanStack React Query:** Server state management and caching
- **Drizzle ORM:** Type-safe database ORM
- **Zod:** Schema validation

### Development Tools
- **TypeScript:** Type safety across full stack
- **Vite:** Fast build tool and dev server
- **ESBuild:** Server bundling for production
- **Wouter:** Lightweight routing library

### Fonts & Assets
- **Google Fonts:** Inter and Space Grotesk font families
- **Generated Images:** Custom space-themed planet and rocket assets in `attached_assets/generated_images/`

### MiniPay Integration
- Designed for Celo's mobile wallet MiniPay
- Auto-connection on MiniPay browsers
- Mobile-optimized UI with touch targets (minimum 48px)
- Bottom navigation for one-handed use