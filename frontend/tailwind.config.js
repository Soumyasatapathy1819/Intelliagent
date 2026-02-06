export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1020",
        panel: "#0f172a",
        panelAlt: "#111827",
        accent: "#38bdf8",
        accentSoft: "#0ea5e9",
        glow: "#7dd3fc"
      },
      fontFamily: {
        sans: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125, 211, 252, 0.35), 0 12px 40px rgba(2, 6, 23, 0.65)",
        soft: "0 20px 60px rgba(15, 23, 42, 0.45)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.4s ease-out"
      }
    }
  },
  plugins: []
};
