import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: ".5625rem",
        md: ".375rem",
        sm: ".1875rem",
      },
      colors: {
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
          border: "hsl(var(--card-border) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
          border: "hsl(var(--popover-border) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
          border: "var(--primary-border)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
          border: "var(--secondary-border)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
          border: "var(--muted-border)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
          border: "var(--accent-border)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
          border: "var(--destructive-border)",
        },
        ring: "hsl(var(--ring) / <alpha-value>)",
        chart: {
          "1": "hsl(var(--chart-1) / <alpha-value>)",
          "2": "hsl(var(--chart-2) / <alpha-value>)",
          "3": "hsl(var(--chart-3) / <alpha-value>)",
          "4": "hsl(var(--chart-4) / <alpha-value>)",
          "5": "hsl(var(--chart-5) / <alpha-value>)",
        },
        sidebar: {
          ring: "hsl(var(--sidebar-ring) / <alpha-value>)",
          DEFAULT: "hsl(var(--sidebar) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-foreground) / <alpha-value>)",
          border: "hsl(var(--sidebar-border) / <alpha-value>)",
        },
        "sidebar-primary": {
          DEFAULT: "hsl(var(--sidebar-primary) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-primary-foreground) / <alpha-value>)",
          border: "var(--sidebar-primary-border)",
        },
        "sidebar-accent": {
          DEFAULT: "hsl(var(--sidebar-accent) / <alpha-value>)",
          foreground: "hsl(var(--sidebar-accent-foreground) / <alpha-value>)",
          border: "var(--sidebar-accent-border)"
        },
        status: {
          online: "rgb(34 197 94)",
          away: "rgb(245 158 11)",
          busy: "rgb(239 68 68)",
          offline: "rgb(156 163 175)",
        },
        space: {
          dark: "#0A0E27",
          darker: "#060818",
          purple: "#1A1F3A",
          blue: "#2D3561",
        },
        celo: {
          green: "#35D07F",
          greenDark: "#2DB872",
          greenLight: "#4AE895",
          yellow: "#FCBA03",
          yellowDark: "#E5A800",
          yellowLight: "#FFD54F",
          gold: "#F5B800",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "rocket-launch": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "20%": { transform: "translateY(-5px) scale(1.02)" },
          "40%": { transform: "translateY(-20px) scale(1.05)" },
          "100%": { transform: "translateY(-100vh) scale(0.8)", opacity: "0" },
        },
        "rocket-fly-up": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "10%": { transform: "translateY(-10px) scale(1.05)" },
          "30%": { transform: "translateY(-50px) scale(1.1)" },
          "100%": { transform: "translateY(-400px) scale(0.5)", opacity: "0" },
        },
        "rocket-shake": {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "25%": { transform: "translateX(-3px) rotate(-1deg)" },
          "50%": { transform: "translateX(3px) rotate(1deg)" },
          "75%": { transform: "translateX(-2px) rotate(-0.5deg)" },
        },
        "planet-float": {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-8px) rotate(3deg)" },
        },
        "planet-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(252, 186, 3, 0.4)" },
          "50%": { boxShadow: "0 0 50px rgba(252, 186, 3, 0.8)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
        "stars-twinkle": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        "star-twinkle": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "countdown-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.1)", opacity: "0.8" },
        },
        "xp-increment": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-20px)", opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "thruster-flicker": {
          "0%, 100%": { opacity: "0.8", transform: "scaleY(1)" },
          "50%": { opacity: "1", transform: "scaleY(1.2)" },
        },
        "smoke-rise": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translateY(-20px) scale(1.5)", opacity: "0.3" },
          "100%": { transform: "translateY(-40px) scale(2)", opacity: "0" },
        },
        "smoke-expand": {
          "0%": { transform: "scale(1)", opacity: "0.5" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        "nebula-drift": {
          "0%, 100%": { transform: "translateX(0) translateY(0)" },
          "25%": { transform: "translateX(10px) translateY(-5px)" },
          "50%": { transform: "translateX(-5px) translateY(10px)" },
          "75%": { transform: "translateX(-10px) translateY(-5px)" },
        },
        "shooting-star": {
          "0%": { transform: "translateX(0) translateY(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateX(200px) translateY(100px)", opacity: "0" },
        },
        "particle-burst": {
          "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
          "100%": { transform: "translateY(-60px) translateX(var(--tx, 0)) scale(0)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rocket-launch": "rocket-launch 3s ease-in forwards",
        "rocket-fly-up": "rocket-fly-up 2.5s ease-in forwards",
        "rocket-shake": "rocket-shake 0.08s ease-in-out infinite",
        "planet-float": "planet-float 4s ease-in-out infinite",
        "planet-glow": "planet-glow 1.5s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s ease-out infinite",
        "stars-twinkle": "stars-twinkle 3s ease-in-out infinite",
        "star-twinkle": "star-twinkle 3s ease-in-out infinite",
        "countdown-pulse": "countdown-pulse 1s ease-in-out infinite",
        "xp-increment": "xp-increment 1s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.3s ease-out forwards",
        "bounce-subtle": "bounce-subtle 2s ease-in-out infinite",
        "thruster-flicker": "thruster-flicker 0.15s ease-in-out infinite",
        "smoke-rise": "smoke-rise 1.5s ease-out infinite",
        "smoke-expand": "smoke-expand 2s ease-out infinite",
        "nebula-drift": "nebula-drift 20s ease-in-out infinite",
        "shooting-star": "shooting-star 2s ease-in infinite",
        "particle-burst": "particle-burst 0.8s ease-out forwards",
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(180deg, #0A0E27 0%, #1A1F3A 50%, #0A0E27 100%)",
        "celo-gradient": "linear-gradient(135deg, #35D07F 0%, #2DB872 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(26, 31, 58, 0.8) 0%, rgba(10, 14, 39, 0.9) 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
