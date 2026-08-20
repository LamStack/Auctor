import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#EAF0FF",
        muted: "#8D93C7",
        paper: "#070821",
        panel: "#10133F",
        line: "#242A63",
        brand: {
          50: "#EFFDFF",
          100: "#D6FAFF",
          200: "#A3F1FC",
          300: "#65E4F5",
          400: "#2FD3EC",
          500: "#0FBEDE",
          600: "#0AA0BD",
          700: "#0B7F98",
          800: "#0F5F73",
          900: "#123F4A",
        },
        accent: {
          50: "#FFF8E8",
          100: "#FFEFC6",
          200: "#FFDE8A",
          300: "#FFC94D",
          400: "#F7B733",
          500: "#E8A317",
          600: "#C0840D",
          700: "#8F620A",
        },
        mint: {
          50: "#E7FBF3",
          100: "#C3F5E1",
          300: "#6EE3B9",
          400: "#3AD49A",
          500: "#1FBE84",
          600: "#149C6B",
        },
        danger: "#FF5C7C",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 24px 70px rgba(0, 0, 0, 0.45)",
        card: "0 8px 24px rgba(0, 0, 0, 0.3)",
        glow: "0 0 0 4px rgba(15, 190, 222, 0.22)",
      },
      backgroundImage: {
        "brand-radial":
          "radial-gradient(circle at 20% 0%, rgba(15, 190, 222, 0.18), transparent 32rem)",
        "game-sky":
          "linear-gradient(180deg, #050617 0%, #0A0D33 38%, #0F1B57 78%, #123F6E 100%)",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(232, 163, 23, 0.55)" },
          "50%": { boxShadow: "0 0 0 12px rgba(232, 163, 23, 0)" },
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
