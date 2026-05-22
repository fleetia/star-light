import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const group = style({
  position: "relative",
  boxSizing: "border-box",
  width: "100%",
  minWidth: 0,
  maxWidth: "100%",
  borderRadius: vars.radius.lg,
  padding: "1rem",
  "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
});

export const controls = style({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0.75rem",
  marginBottom: "0.85rem",
  "@media": {
    "(min-width: 768px)": {
      gridTemplateColumns: "repeat(2, max-content) minmax(12rem, 1fr)",
      alignItems: "end"
    }
  }
});

export const sizeInput = style({
  width: "5rem"
});

export const zoom = style({
  gridColumn: "1 / -1",
  "@media": {
    "(min-width: 768px)": { gridColumn: "auto" }
  }
});

export const viewMode = style({
  gridColumn: "1 / -1"
});

export const stitchBar = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.45rem",
  marginBottom: "0.75rem"
});

export const stitchButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  minHeight: "2rem",
  border: `1px solid ${vars.color.borderLight}`,
  borderRadius: vars.radius.sm,
  background: vars.color.white,
  color: vars.color.text,
  padding: "0.35rem 0.55rem",
  font: "inherit",
  fontSize: vars.fontSize.base,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.hoverBg },
    '&[aria-pressed="true"]': {
      background: vars.color.activeBg,
      borderColor: vars.color.activeBg,
      color: vars.color.white
    }
  }
});

export const stitchSymbol = style({
  width: "1.6rem",
  height: "1.35rem"
});

export const customStitch = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem"
});

export const deleteButton = style({
  border: 0,
  borderRadius: vars.radius.sm,
  background: "rgba(0, 0, 0, 0.08)",
  color: "inherit",
  cursor: "pointer",
  font: "inherit",
  fontSize: vars.fontSize.xs,
  padding: "0.2rem 0.3rem",
  selectors: {
    "&:hover": { background: "rgba(0, 0, 0, 0.16)" }
  }
});

export const iconPicker = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.45rem",
  marginBottom: "0.75rem"
});

export const iconButton = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35rem",
  minHeight: "2rem",
  border: `1px solid ${vars.color.borderLight}`,
  borderRadius: vars.radius.sm,
  background: vars.color.white,
  color: vars.color.text,
  padding: "0.3rem 0.5rem",
  font: "inherit",
  fontSize: vars.fontSize.sm,
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.hoverBg },
    '&[aria-pressed="true"]': {
      background: vars.color.text,
      borderColor: vars.color.text,
      color: vars.color.white
    }
  }
});

export const iconPreview = style({
  width: "1.8rem",
  height: "1.25rem"
});

export const addRow = style({
  display: "flex",
  alignItems: "end",
  gap: "0.5rem",
  marginBottom: "0.85rem",
  flexWrap: "wrap"
});

export const addInput = style({
  width: "7rem"
});

export const spanInput = style({
  width: "5.5rem"
});

export const pathInput = style({
  flex: "1 1 18rem",
  minWidth: "12rem"
});

export const gridWrap = style({
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  overflow: "auto",
  maxHeight: "min(60vh, 32rem)",
  paddingBottom: "0.25rem"
});

export const grid = style({
  display: "grid",
  gap: "1px",
  width: "max-content",
  minWidth: "100%",
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
  display: "grid",
  placeItems: "center",
  background: vars.color.white,
  color: vars.color.textMuted,
  fontSize: "8px",
  fontWeight: 700,
  lineHeight: 1
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
  width: "100%",
  minWidth: 0,
  border: `1px solid ${vars.color.borderLight}`,
  borderRadius: 0,
  background: vars.color.white,
  color: vars.color.text,
  font: "inherit",
  fontSize: vars.fontSize.xs,
  fontWeight: 700,
  padding: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "pointer",
  selectors: {
    "&:hover": { background: vars.color.hoverBg },
    "&:focus-visible": {
      outline: `2px solid ${vars.color.accent}`,
      outlineOffset: 1
    }
  }
});
