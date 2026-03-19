import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.6rem"
});

export const stats = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.md }
  }
});

export const scarf = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: vars.radius.md,
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
});

export const row = style({
  display: "flex",
  height: 10,
  cursor: "pointer",
  transition: "height 0.15s, opacity 0.15s",
  selectors: {
    "&:hover": { height: 24 }
  },
  "@media": {
    "(min-width: 768px)": { height: 12 }
  }
});

globalStyle(`${row}:hover`, {
  "@media": {
    "(min-width: 768px)": { height: 28 }
  }
});

export const done = style({
  opacity: 0.35
});

export const expanded = style({
  height: 24,
  "@media": {
    "(min-width: 768px)": { height: 28 }
  }
});

export const bar = style({
  flex: 1,
  display: "flex",
  alignItems: "center",
  position: "relative"
});

export const tooltip = style({
  display: "none",
  position: "absolute",
  left: "50%",
  transform: "translateX(-50%)",
  fontSize: vars.fontSize.xs,
  color: vars.color.white,
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
  whiteSpace: "nowrap",
  pointerEvents: "none"
});

globalStyle(`${row}:hover ${tooltip}`, {
  display: "block"
});

globalStyle(`${expanded} ${tooltip}`, {
  display: "block"
});

globalStyle(`${done} ${tooltip}`, {
  textDecoration: "line-through"
});
