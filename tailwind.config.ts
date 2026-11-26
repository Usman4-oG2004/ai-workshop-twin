import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F2EEE5",
          hi: "#FAF8F3",
          lo: "#E6E0D3",
        },
        ink: {
          DEFAULT: "#18181B",
          secondary: "#3F3F46",
          muted: "#52525B",
          faded: "#71717A",
        },
        rule: {
          DEFAULT: "rgba(24, 24, 27, 0.14)",
          soft: "rgba(24, 24, 27, 0.08)",
        },
        trade: {
          electrical: "#B45309",
          "electrical-bg": "#FEF3C7",
          plumbing: "#0F766E",
          "plumbing-bg": "#CCFBF1",
        },
        // Keep legacy token aliases so any shared utilities resolve cleanly
        workshop: {
          bg: "#F2EEE5",
          surface: "#FAF8F3",
          elevated: "#E6E0D3",
          border: "#D6D0C4",
          "border-light": "#C2BBB0",
          muted: "#71717A",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#D97706",
          500: "#B45309",
          600: "#92400E",
          700: "#78350F",
          800: "#451A03",
          900: "#451A03",
        },
        arc: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          300: "#5EEAD4",
          400: "#0F766E",
          500: "#0D9488",
          600: "#115E59",
          700: "#134E4A",
        },
        safety: {
          red: "#B91C1C",
          green: "#15803D",
          yellow: "#B45309",
          orange: "#C2410C",
        },
        chalk: {
          DEFAULT: "#18181B",
          dim: "#27272A",
          muted: "#52525B",
          faded: "#71717A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-serif)", "Georgia", "serif"],
        heading: ["var(--font-sans)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        body: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        workshop: "4px",
      },
      boxShadow: {
        desk: "0 1px 2px rgba(24,24,27,0.05), 0 12px 32px -16px rgba(24,24,27,0.12)",
        frost: "0 20px 44px -24px rgba(24,24,27,0.28), inset 0 1px 0 rgba(255,255,255,0.7)",
      },
    },
  },
  plugins: [],
};

export default config;
