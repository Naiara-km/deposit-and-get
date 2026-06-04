import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand — bound to BetKing CSS variables (see src/styles/tokens.css)
        brand: {
          navy: "var(--ui-primary-main)", // #001041
          "navy-dark": "var(--ui-primary-dark)", // #000b2d
          "navy-light": "var(--ui-primary-light)", // #333f67
          yellow: "var(--ui-value-main)", // #f1c72f
          "yellow-dark": "var(--ui-value-dark)", // #e5b000
          "yellow-light": "var(--ui-value-light)", // #ffd64d
          blue: "var(--ui-secondary-main)", // #255dbd
          "blue-dark": "var(--ui-secondary-dark)", // #194184
          "blue-light": "var(--ui-secondary-light)", // #507dca
          cyan: "var(--ui-highlight-main)", // #1affff
          red: "var(--ui-notification-main)", // #ff0041
        },
        surface: {
          DEFAULT: "var(--ui-background-paper)",
          app: "var(--ui-background-default)",
          muted: "var(--ui-background-8p)",
          backdrop: "var(--ui-background-backdrop)",
        },
        text: {
          emphasis: "var(--ui-text-emphasis)",
          primary: "var(--ui-text-primary)",
          secondary: "var(--ui-text-secondary)",
          disabled: "var(--ui-text-disabled)",
        },
        success: "var(--ui-semantic-colours-success-main)",
        warning: "var(--ui-semantic-colours-warning-main)",
        error: "var(--ui-notification-main)",
        info: "var(--ui-semantic-colours-info-main)",
        divider: "var(--ui-components-borders-divider)",
        outline: "var(--ui-components-borders-outline-border)",
        // SuperSportBet global header (Figma: Bonus-Engine ENG-1480, node 3559-20966)
        // Light-on-dark chrome tokens — distinct from the BetKing body palette above.
        ssb: {
          bg: "var(--ui-primary-main)", // Background/Backdrop (brand navy override)
          fg: "#e3f1fd", // Hybrid/Text/Primary
          "fg-muted": "rgba(227,241,253,0.6)", // Hybrid/Text/Secondary
          "tint-12": "rgba(227,241,253,0.12)", // Primary shades/12p (balance pill)
          "tint-16": "rgba(227,241,253,0.16)", // Primary shades/16p (active tab)
        },
        // Deposit & Get — handoff palette (Claude Design, 2026-05-29).
        // Drives the new PromoCard + Promo Details surfaces.
        dg: {
          // dark-navy chrome
          card: "#1A1F8C", // Brand navy (card body)
          footer: "#0E1652", // Footer band on card / status card bg on Details
          navy: "#161C7A", // Detail page dark section bg
          "navy-top": "#0E1357", // Status bar bg
          "ended-footer": "#1F1F1F", // Footer band on ended (B&W) states
          sticky: "#040B67", // Sticky CTA bg (Figma 40:2768 / 40:2485)
          // accents
          gold: "#FFC72C",
          coral: "#FF9B7A", // Low-pool "Almost gone" ONLY
          "done-green": "#3DD17A",
          // text on dark
          ink: "#FFFFFF",
          "ink-dim": "rgba(255,255,255,0.62)",
          "ink-mute": "rgba(255,255,255,0.38)",
          rail: "rgba(255,255,255,0.16)",
          // light section
          lavender: "#ECEAF6",
          "ink-dark": "#1B1B2B", // Headings on lavender
          "ink-sub": "#6B6B85", // Secondary text on light
        },
      },
      boxShadow: {
        sm: "var(--ui-shadow-sm)",
        DEFAULT: "var(--ui-shadow-default)",
        md: "var(--ui-shadow-md)",
        lg: "var(--ui-shadow-lg)",
        xl: "var(--ui-shadow-xl)",
        "2xl": "var(--ui-shadow-2xl)",
        overlay: "var(--ui-shadow-custom-overlay-md)",
      },
      borderRadius: {
        card: "12px",
        pill: "999px",
      },
      fontFamily: {
        sans: [
          "DM Sans",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      keyframes: {
        "vf-fall": {
          "0%": { transform: "translateY(-20%) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(700%) rotate(540deg)", opacity: "0" },
        },
      },
      animation: {
        "vf-fall": "vf-fall 2.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
