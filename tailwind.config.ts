import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f2fbfa",
          100: "#d8f5f2",
          200: "#b3ebe3",
          300: "#82ddd1",
          400: "#4ec8bb",
          500: "#21ad9f",
          600: "#179082",
          700: "#137369",
          800: "#115c56",
          900: "#0f4b47"
        }
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 8px 30px rgba(0,0,0,0.12)"
      }
    }
  },
  plugins: []
} satisfies Config;
