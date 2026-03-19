import { createGlobalTheme } from "@vanilla-extract/css";
import { vars as lpVars } from "@star-light/components";

createGlobalTheme(":root", lpVars, {
  em: "16px",
  iconSize: "32px",
  gap: "1em",
  color: {
    accent: "#4a90d9",
    accentText: "#fff",
    surface: "#faf9f6",
    text: "#333",
    border: "#e5e5e5",
    hoverBg: "#f0f0f0",
    hoverText: "#1a1a1a",
    muted: "#888"
  }
});
