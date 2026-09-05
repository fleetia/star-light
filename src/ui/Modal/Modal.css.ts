import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 1000,
  background: "rgba(0, 0, 0, 0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

const modalBase = style({
  width: "100%",
  maxHeight: "85vh",
  backdropFilter: "blur(12px)",
  color: vars.color.text,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`
});

export const modal = styleVariants({
  sm: [modalBase, { maxWidth: "400px" }],
  md: [modalBase, { maxWidth: "560px" }],
  lg: [modalBase, { maxWidth: "720px" }]
});

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.75em 1.25em"
});

export const title = style({
  fontSize: "0.9rem",
  fontWeight: 600,
  margin: 0
});

export const closeButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "1rem",
  color: vars.color.muted,
  padding: "2px 6px",
  transition: "color 0.15s",
  selectors: {
    "&:hover": {
      color: vars.color.text
    }
  }
});

export const body = style({
  flex: 1,
  overflowY: "auto",
  padding: "1em 1.25em"
});
