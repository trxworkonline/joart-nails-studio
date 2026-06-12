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
        background: "var(--background)",
        foreground: "var(--foreground)",
        joart: {
          vanilla: "#FFF9F4",
          nude: "#F5E8DC",
          blush: "#F7D9E0",
          rose: "#E8B4C0",
          brand: "#7A5040",
          text: "#5C3D3D",
          "text-soft": "#8B6A6A",
          "text-muted": "#B89090",
        },
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        pinyon: ["var(--font-pinyon)", "cursive"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
