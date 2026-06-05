import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F7F4EE",
        mist: "#EDE8DE",
        paper: "#FBFAF6",
        ink: "#1A1814",
        ink2: "#5A554C",
        faint: "#A8A29B",
        green: "#2D3E2D",
        rust: "#9B5443",
        line: "#D8D3C8",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        serif: ["var(--font-body)"],
        sans: ["var(--font-ui)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
