import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14122B",
        muted: "#6B6790",
        paper: "#F6F5FF",
        panel: "#FFFFFF",
        line: "#E4E1FA",
        brand: {
          50: "#F1EFFE",
          100: "#E3DFFD",
          200: "#C4BBFB",
          300: "#A296F7",
          400: "#7C6DF2",
          500: "#5B4FE9",
          600: "#463BCB",
          700: "#3E32C7",
          800: "#2C2494",
          900: "#1E1966",
        },
        accent: {
          50: "#FFF1EA",
          100: "#FFE0CE",
          200: "#FFC19E",
          300: "#FF9E6D",
          400: "#FF8A56",
          500: "#FF7A45",
          600: "#E85F2B",
          700: "#C24A1E",
        },
        mint: {
          50: "#E9FBF7",
          100: "#C8F5EB",
          300: "#6EE3C9",
          400: "#3AD4B4",
          500: "#22D3B8",
          600: "#149C87",
        },
        danger: "#F0466E",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px rgba(30, 25, 102, 0.12)",
        card: "0 8px 24px rgba(30, 25, 102, 0.08)",
        glow: "0 0 0 4px rgba(255, 122, 69, 0.18)",
      },
      backgroundImage: {
        "brand-radial":
          "radial-gradient(circle at 20% 0%, rgba(91, 79, 233, 0.16), transparent 32rem)",
        "game-sky":
          "linear-gradient(180deg, #201A5C 0%, #362C8F 38%, #5B4FE9 78%, #7C6DF2 100%)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255, 122, 69, 0.5)" },
          "50%": { boxShadow: "0 0 0 12px rgba(255, 122, 69, 0)" },
        },
      },
      animation: {
        float: "float 3.2s ease-in-out infinite",
        pulseGlow: "pulseGlow 2s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
