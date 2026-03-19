import {
  createGlobalThemeContract,
  createGlobalTheme
} from "@vanilla-extract/css";

import { lightTheme } from "../theme/presets";

export const vars = createGlobalThemeContract({
  em: "--em",
  iconSize: "--icon-size",
  gap: "--gap",
  color: {
    accent: "--c-accent",
    accentText: "--c-accent-text",
    surface: "--c-surface",
    text: "--c-text",
    border: "--c-border",
    hoverBg: "--c-hover-bg",
    hoverText: "--c-hover-text",
    muted: "--c-muted"
  }
});

createGlobalTheme(":root", vars, {
  em: "16px",
  iconSize: "32px",
  gap: "1em",
  color: {
    accent: lightTheme.accent,
    accentText: lightTheme.accentText,
    surface: lightTheme.surface,
    text: lightTheme.text,
    border: lightTheme.border,
    hoverBg: lightTheme.hoverBg,
    hoverText: lightTheme.hoverText,
    muted: lightTheme.muted
  }
});
