import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
      },
      colors: {
        ink: "#f3f7ff",
        line: "rgba(255, 255, 255, 0.09)",
        panel: "rgba(12, 18, 34, 0.72)",
        shell: "#060b17",
      },
      boxShadow: {
        haze: "0 30px 100px rgba(2, 6, 23, 0.45)",
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
};

export default config;
