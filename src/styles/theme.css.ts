import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    white: "#fff",
    bg: "#faf9f6",
    text: "#333",
    textLight: "#555",
    textMuted: "#888",
    textPlaceholder: "#999",
    textSubtle: "#aaa",
    textFaint: "#bbb",
    textDark: "#1a1a1a",
    border: "#e5e5e5",
    borderLight: "#ddd",
    hoverBg: "#f0f0f0",
    inactiveBg: "#f5f5f5",
    accent: "#4a90d9",
    error: "#c0392b",
    activeBg: "#333"
  },
  radius: {
    sm: "4px",
    md: "8px",
    lg: "12px"
  },
  fontSize: {
    xs: "0.65rem",
    sm: "0.7rem",
    base: "0.75rem",
    md: "0.8rem",
    lg: "0.85rem",
    xl: "0.9rem",
    "2xl": "0.95rem",
    "3xl": "1.1rem",
    "4xl": "1.3rem",
    "5xl": "1.6rem"
  }
});
