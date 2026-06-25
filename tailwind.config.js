/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        banbif: {
          blue: "#009FE3",
          ink: "#07111F",
          navy: "#0B172A",
          violet: "#8B4CF6",
          violetDark: "#4C1D95",
          surface: "#F5F7FB",
          border: "#E5E7EB",
          text: "#111827",
          muted: "#64748B",
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#38BDF8"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};
