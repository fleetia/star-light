import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({
  borderRadius: vars.radius.lg,
  padding: "1rem"
});

export const scarf = style({
  display: "flex",
  height: 48,
  borderRadius: vars.radius.md,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
  width: "100%"
});

export const col = style({
  flex: 1,
  minWidth: 0
});

export const empty = style({
  background: vars.color.border,
  opacity: 0.3
});
