import { style } from "@vanilla-extract/css";
import { vars } from "./theme.css";

export const legend = style({
  display: "flex",
  gap: "0.8rem",
  marginTop: "0.6rem",
  flexWrap: "wrap"
});

export const legendItem = style({
  display: "flex",
  alignItems: "center",
  gap: "0.3rem",
  fontSize: vars.fontSize.sm,
  color: vars.color.textLight,
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.md }
  }
});

export const swatch = style({
  width: 12,
  height: 12,
  borderRadius: 3,
  border: "1px solid rgba(0, 0, 0, 0.1)",
  "@media": {
    "(min-width: 768px)": { width: 16, height: 16 }
  }
});
