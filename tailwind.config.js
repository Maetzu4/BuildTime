/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./src/**/*.{js,ts,jsx,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── Base ──────────────────────────────────────────────
        dark: "#12111A",
        background: "#12111A",
        foreground: "#E6E1E5",

        // ── Brand ─────────────────────────────────────────────
        primary: {
          DEFAULT: "#6C3FC5",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#3B82F6",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F59E0B",
          foreground: "#1C1B1F",
        },
        destructive: {
          DEFAULT: "#F87171",
          foreground: "#1C1B1F",
        },

        // ── Material Design 3 ──────────────────────────────────
        m3: {
          primary: "var(--m3-primary)",
          "on-primary": "var(--m3-on-primary)",
          "primary-container": "var(--m3-primary-container)",
          "on-primary-container": "var(--m3-on-primary-container)",
          secondary: "var(--m3-secondary)",
          "on-secondary": "var(--m3-on-secondary)",
          "secondary-container": "var(--m3-secondary-container)",
          "on-secondary-container": "var(--m3-on-secondary-container)",
          tertiary: "var(--m3-tertiary)",
          "on-tertiary": "var(--m3-on-tertiary)",
          "tertiary-container": "var(--m3-tertiary-container)",
          "on-tertiary-container": "var(--m3-on-tertiary-container)",
          error: "var(--m3-error)",
          "on-error": "var(--m3-on-error)",
          "error-container": "var(--m3-error-container)",
          "on-error-container": "var(--m3-on-error-container)",
          background: "var(--m3-background)",
          "on-background": "var(--m3-on-background)",
          surface: "var(--m3-surface)",
          "on-surface": "var(--m3-on-surface)",
          "surface-variant": "var(--m3-surface-variant)",
          "on-surface-variant": "var(--m3-on-surface-variant)",
          outline: "var(--m3-outline)",
          "outline-variant": "var(--m3-outline-variant)",
          shadow: "var(--m3-shadow)",
          scrim: "var(--m3-scrim)",
          "inverse-surface": "var(--m3-inverse-surface)",
          "inverse-on-surface": "var(--m3-inverse-on-surface)",
          "inverse-primary": "var(--m3-inverse-primary)",
          // Surface containers
          "surface-container-lowest": "var(--m3-surface-container-lowest)",
          "surface-container-low": "var(--m3-surface-container-low)",
          "surface-container": "var(--m3-surface-container)",
          "surface-container-high": "var(--m3-surface-container-high)",
          "surface-container-highest": "var(--m3-surface-container-highest)",
        },

        // ── Surface ───────────────────────────────────────────
        card: {
          DEFAULT: "#1E1B26",
          foreground: "#E6E1E5",
        },
        muted: {
          DEFAULT: "#2C2838",
          foreground: "#9CA3AF",
        },
        popover: {
          DEFAULT: "#1E1B26",
          foreground: "#E6E1E5",
        },

        // ── Utility ───────────────────────────────────────────
        border: "#2C2838",
        input: "#2C2838",
        ring: "#6C3FC5",

        // ── Charts ────────────────────────────────────────────
        "chart-1": "#6C3FC5",
        "chart-2": "#3B82F6",
        "chart-3": "#F59E0B",
        "chart-4": "#10B981",
        "chart-5": "#F43F5E",
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      fontFamily: {
        sans: ["Inter", "System"],
      },
    },
  },
  plugins: [],
};
