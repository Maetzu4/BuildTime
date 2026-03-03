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
