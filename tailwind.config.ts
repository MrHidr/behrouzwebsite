import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        yekan: ["var(--font-yekan)", "sans-serif"],
        dast: ["var(--font-dast)", "cursive"],
        montserrat: ["var(--font-montserrat)", "sans-serif"],
      },
      colors: {
        behrouz: {
          red: "#e42e1d",
          accent: "#f3383a",
          ink: "#100e0e",
        },
      },
      borderRadius: {
        frame: "64px",
      },
      boxShadow: {
        pill: "0px 4px 24px rgba(0,0,0,0.12)",
        chip: "0px 4px 8px rgba(0,0,0,0.1)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
