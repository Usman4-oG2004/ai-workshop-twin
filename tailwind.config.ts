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
        workshop: {
          bg: "#09090B",
          surface: "#111113",
          elevated: "#1A1A1E",
          border: "#2A2A2F",
          "border-light": "#3F3F46",
          muted: "#71717A",
        },
        amber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
          800: "#92400E",
          900: "#78350F",
          950: "#451A03",
        },
        arc: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
        },
        copper: {
          400: "#D4A574",
          500: "#C4956A",
          600: "#B07D4F",
        },
        safety: {
          red: "#EF4444",
          green: "#4ADE80",
          yellow: "#FBBF24",
          orange: "#FB923C",
        },
        chalk: {
          DEFAULT: "#FAFAFA",
          dim: "#D4D4D8",
          muted: "#A1A1AA",
          faded: "#71717A",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        heading: ["var(--font-space)", "system-ui", "sans-serif"],
        body: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      fontSize: {
        "hero": ["5.5rem", { lineHeight: "0.9", letterSpacing: "0.02em" }],
        "display": ["3.75rem", { lineHeight: "0.95", letterSpacing: "0.02em" }],
        "title": ["2.25rem", { lineHeight: "1.1", letterSpacing: "0.01em" }],
      },
      backgroundImage: {
        "grid-pattern": `
          linear-gradient(rgba(250, 250, 250, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(250, 250, 250, 0.03) 1px, transparent 1px)
        `,
        "grid-dense": `
          linear-gradient(rgba(250, 250, 250, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(250, 250, 250, 0.05) 1px, transparent 1px)
        `,
        "hazard-stripe": `repeating-linear-gradient(
          -45deg,
          #F59E0B,
          #F59E0B 10px,
          #09090B 10px,
          #09090B 20px
        )`,
        "blueprint": `
          linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)
        `,
        "noise": "url('/images/noise.png')",
        "scan-lines": `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0,0,0,0.03) 2px,
          rgba(0,0,0,0.03) 4px
        )`,
      },
      backgroundSize: {
        "grid-sm": "20px 20px",
        "grid-md": "40px 40px",
        "grid-lg": "80px 80px",
      },
      boxShadow: {
        "workshop": "0 0 0 1px rgba(250, 250, 250, 0.05), 0 4px 24px rgba(0,0,0,0.5)",
        "glow-amber": "0 0 20px rgba(245, 158, 11, 0.15), 0 0 60px rgba(245, 158, 11, 0.05)",
        "glow-arc": "0 0 20px rgba(56, 189, 248, 0.15), 0 0 60px rgba(56, 189, 248, 0.05)",
        "inset-workshop": "inset 0 1px 0 rgba(250, 250, 250, 0.05), inset 0 -1px 0 rgba(0,0,0,0.3)",
      },
      borderRadius: {
        "workshop": "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "flicker": "flicker 0.15s ease-in-out infinite alternate",
        "scan": "scan 8s linear infinite",
        "spark": "spark 0.6s ease-out forwards",
        "flow": "flow 2s ease-in-out infinite",
        "meter-fill": "meterFill 1.5s ease-out forwards",
        "stamp": "stamp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        flicker: {
          "0%": { opacity: "0.95" },
          "100%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        spark: {
          "0%": { opacity: "1", transform: "scale(0) rotate(0deg)" },
          "50%": { opacity: "0.8", transform: "scale(1.2) rotate(180deg)" },
          "100%": { opacity: "0", transform: "scale(0.8) rotate(360deg)" },
        },
        flow: {
          "0%, 100%": { strokeDashoffset: "0" },
          "50%": { strokeDashoffset: "20" },
        },
        meterFill: {
          "0%": { width: "0%" },
          "100%": { width: "var(--meter-value)" },
        },
        stamp: {
          "0%": { opacity: "0", transform: "scale(2) rotate(-12deg)" },
          "60%": { opacity: "1", transform: "scale(0.9) rotate(-6deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-6deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
