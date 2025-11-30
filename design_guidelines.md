# RocketMint Design Guidelines

## Design Approach
**Custom Space-Gaming Experience** inspired by modern mobile gaming interfaces (similar to interactive games like Aviator/JetX) with a distinctive cosmic aesthetic tailored for Celo's mobile-first ecosystem.

## Core Visual Identity

**Theme:** Dark Cyber-Space with Celo-Green Accents
- Deep space blacks (#0A0E27, #121633)
- Cosmic purples/blues for depth (#1A1F3A, #2D3561)
- **Celo-green (#35D07F)** as primary accent for CTAs, success states, XP gains
- Bright whites (#FFFFFF) for critical text and highlights
- Soft grays (#8B92B0) for secondary text

## Typography

**Font Families:**
- Headers: Inter Bold/Extra Bold (700-800 weight) - clean, modern, legible on mobile
- Body: Inter Regular/Medium (400-500 weight)
- Accent Numbers (XP, scores): Space Grotesk Bold - slightly futuristic

**Hierarchy:**
- Hero Headlines: text-4xl to text-5xl (mobile), text-6xl to text-7xl (desktop)
- Section Titles: text-2xl to text-3xl
- Body Text: text-base to text-lg
- Small Text/Labels: text-sm to text-xs

## Layout System

**Spacing Units:** Tailwind 4, 6, 8, 12, 16, 24 for consistency
- Component padding: p-4 (mobile), p-6 to p-8 (desktop)
- Section spacing: py-12 (mobile), py-16 to py-24 (desktop)
- Card gaps: gap-4 to gap-6

**Container Strategy:**
- Max-width: max-w-7xl for full sections
- Content blocks: max-w-2xl for focused content
- Full-bleed for rocket animation areas

## Component Library

### Navigation
- **Mobile:** Sticky bottom navigation with large touch targets (min 48px height)
- Icons with labels for: Home, Leaderboard, Profile, Wallet
- Glass-morphism effect (backdrop-blur-md with semi-transparent dark bg)

### Cards
- Rounded corners: rounded-xl to rounded-2xl
- Subtle borders: border border-white/10
- Backgrounds: bg-gradient-to-br from-[#1A1F3A] to-[#0A0E27]
- Padding: p-6
- Hover: Slight elevation with shadow-xl and scale-[1.02] transform

### Buttons
**Primary (Predictions, Launches):**
- Background: Celo-green gradient (bg-gradient-to-r from-[#35D07F] to-[#2DB872])
- Text: text-white font-semibold
- Size: Large touch targets (min h-12 to h-14, px-8)
- Rounded: rounded-full
- Hover: brightness-110

**Secondary (Info, Cancel):**
- Outline style: border-2 border-white/20
- Text: text-white
- Hover: bg-white/10

**Blurred Overlays (on images):**
- backdrop-blur-md bg-white/10
- NO hover effects needed (button handles own states)

### Planet Selection Interface
- Horizontal scrollable carousel (snap-scroll)
- Each planet: circular div (w-24 h-24 on mobile, w-32 h-32 desktop)
- Active planet: ring-4 ring-[#35D07F] with glow effect
- Planet names below in text-sm

### Animation Containers
- Rocket launch area: Full viewport height (h-screen or min-h-screen)
- Countdown overlay: Absolute positioned with backdrop-blur
- Launch button: Fixed bottom with safe-area padding

### Leaderboard Table
- Sticky header row
- Alternating row backgrounds: bg-white/5
- User's row highlighted: bg-[#35D07F]/20
- Rank badges: Circular with gradient fills (gold/silver/bronze for top 3)

### XP Display
- Large numerical emphasis: text-4xl font-bold in Space Grotesk
- Progress bar: h-3 rounded-full with gradient fill
- Animated increment on results screen

### Profile Stats
- Grid layout: grid-cols-2 gap-4 (mobile), grid-cols-3 (desktop)
- Stat cards: Centered text, large number on top, label below
- Badge showcase: Grid of unlocked badges with grayscale for locked ones

## Screen-Specific Layouts

### Home Screen
- Hero: Full-height rocket launch pad with animated rocket
- Celo HQ background image (hero-bg-space.jpg): Cosmic vista with distant planets
- "Launch Rocket" CTA: Center bottom with pulsing animation
- Planet carousel: Horizontal scroll below hero

### Prediction Screen
- Planet carousel: Top third of screen
- Selection indicator: Center with large selected planet
- Wallet connection: Card below with balance display
- Submit button: Bottom fixed position

### Rocket Flight
- Full-screen animation canvas
- Countdown timer: Top center, large (text-6xl)
- Rocket trajectory: CSS transforms or Lottie
- Stars/particles background

### Results Screen
- Hero result: Large planet image at top with "LANDED ON [PLANET]" text
- Win/Loss indicator: Bold, color-coded (green for win, red for loss)
- XP gained: Animated counter with +X display
- Micro-reward button: If applicable, Celo-green CTA
- "Play Again" CTA below

### Leaderboard
- Top 3 podium: Visual card layout with medals
- Scrollable table below
- Filter tabs: "All Time", "This Week", "Friends"

### Profile
- Header card: Avatar, username, total XP, current level
- Stats grid: Total predictions, win rate, streak
- Badge collection: Grid of earned badges
- Recent predictions: List of last 10 with outcomes

## Images

**Required Images:**
1. **Hero Background (home-hero.jpg):** Deep space panorama with visible planets, stars, nebula - sets cosmic tone
2. **Rocket Asset (rocket.png):** Sleek, modern rocket sprite for animation - transparent PNG
3. **Planet Set (planet-[name].png):** 5-8 distinct planet illustrations (Mars-like red, Earth-like blue, Saturn rings, etc.)
4. **Celo HQ Launch Pad (launch-pad.jpg):** Futuristic platform with Celo branding elements

**Image Placement:**
- Hero: Full-screen background on home
- Planets: Throughout prediction and results screens
- Launch pad: Background element on home screen bottom

## Accessibility & Mobile Optimization

- All interactive elements: min 44px touch target
- Text contrast: WCAG AA minimum (white on dark backgrounds)
- Focus indicators: Visible ring-2 ring-[#35D07F]
- Safe area padding: pb-safe (iOS notch consideration)

## Animation Philosophy
**Use sparingly** - only where enhancing gameplay experience:
- Rocket launch sequence (core feature)
- XP counter increment on results
- Subtle planet rotation in carousel
- Card entrance animations (fade-in-up)
- NO distracting background animations or parallax effects

This design creates a polished, mobile-first gaming experience that balances visual excitement with usability, leveraging Celo's brand colors within an immersive space theme.