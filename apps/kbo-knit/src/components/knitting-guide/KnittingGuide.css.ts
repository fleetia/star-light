import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.6rem"
});

export const progress = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted
});

export const list = style({
  fontSize: vars.fontSize.base,
  lineHeight: 1.6,
  color: vars.color.textLight,
  fontFamily: "monospace",
  maxHeight: "60vh",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.md, maxHeight: 500 }
  }
});

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: "0.4rem",
  padding: "0.3rem",
  borderRadius: vars.radius.sm,
  transition: "background 0.1s",
  cursor: "pointer",
  minHeight: 32,
  selectors: {
    "&:active": { background: vars.color.hoverBg }
  },
  "@media": {
    "(min-width: 768px)": {
      minHeight: "auto",
      padding: "0.2rem 0.4rem"
    }
  }
});

export const checked = style({
  opacity: 0.45,
  textDecoration: "line-through"
});

export const checkbox = style({
  width: 18,
  height: 18,
  cursor: "pointer",
  accentColor: vars.color.accent,
  flexShrink: 0,
  "@media": {
    "(min-width: 768px)": { width: 16, height: 16 }
  }
});

export const rowNum = style({
  width: 24,
  textAlign: "right",
  color: vars.color.textFaint,
  flexShrink: 0,
  fontSize: vars.fontSize.sm
});

export const swatch = style({
  display: "inline-block",
  width: 12,
  height: 12,
  borderRadius: 2,
  border: "1px solid rgba(0, 0, 0, 0.1)",
  flexShrink: 0
});
