import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({
  display: "grid",
  gap: "0.65rem",
  minWidth: 0,
  maxWidth: "100%"
});

export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

export const progress = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.md }
  }
});

export const chartWrap = style({
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflowX: "auto",
  borderRadius: vars.radius.md,
  background: vars.color.white,
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)"
});

export const chart = style({
  display: "grid",
  gap: "1px",
  width: "max-content",
  background: vars.color.borderLight
});

export const row = style({
  display: "grid",
  gap: "1px",
  background: vars.color.borderLight
});

export const rowNumber = style({
  position: "sticky",
  left: 0,
  zIndex: 1,
  minWidth: "2.8rem",
  border: 0,
  background: vars.color.white,
  color: vars.color.textMuted,
  font: "inherit",
  fontSize: vars.fontSize.xs,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.hoverBg },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: -2
    }
  }
});

export const footerRow = style({
  position: "sticky",
  bottom: 0,
  zIndex: 2,
  display: "grid",
  gap: "1px",
  background: vars.color.borderLight
});

export const corner = style({
  position: "sticky",
  left: 0,
  zIndex: 3,
  minWidth: "2.8rem",
  minHeight: "1rem",
  background: vars.color.white
});

export const colNumber = style({
  minWidth: 0,
  minHeight: "1rem",
  display: "grid",
  placeItems: "center",
  background: vars.color.white,
  color: vars.color.textMuted,
  fontSize: "8px",
  fontWeight: 700,
  lineHeight: 1
});

export const cell = style({
  position: "relative",
  width: "100%",
  minWidth: 0,
  border: 0,
  font: "inherit",
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  padding: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "pointer",
  boxShadow: "inset 0 0 0 1px rgba(255, 255, 255, 0.38)",
  selectors: {
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: -2
    }
  }
});

export const done = style({
  opacity: 0.38
});
