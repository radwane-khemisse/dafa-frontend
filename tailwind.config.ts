import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: "#FAF7EF",
          100: "#EFE6D8",
          200: "#D8C6A8",
        },
        date: "#4A3329",
        charcoal: "#25231F",
        olive: "#4F5F46",
        sage: "#A7B79A",
        clay: "#B6653F",
        copper: "#955037",
        gold: "#C8943D",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(36, 33, 28, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
