import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const input = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "0.3em",
  width: "100%",
  padding: "0.4em 0.5em",
  lineHeight: 1.15,
  border: `1px solid ${vars.color.border}`,
  borderRadius: 4,
  background: vars.color.surface,
  fontSize: "0.8rem",
  color: vars.color.text,
  boxSizing: "border-box",
  cursor: "pointer",
  selectors: {
    "&:focus-within": {
      outline: "none",
      boxShadow: `0 0 0 1px ${vars.color.accent}`
    }
  }
});

export const inputError = style({
  borderColor: "#dc3545",
  selectors: {
    "&:focus-within": {
      boxShadow: "0 0 0 1px #dc3545"
    }
  }
});

export const segment = style({
  fontSize: "inherit",
  fontFamily: "inherit",
  color: "inherit",
  pointerEvents: "none"
});

export const separator = style({
  color: vars.color.muted,
  userSelect: "none",
  fontSize: "0.75rem",
  pointerEvents: "none"
});

export const nativeInput = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  opacity: 0,
  cursor: "pointer",
  boxSizing: "border-box"
});
