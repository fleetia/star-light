import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const overlay = style({
  position: "fixed",
  inset: 0,
  zIndex: 1100,
  background: "rgba(0, 0, 0, 0.3)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

export const dialog = style({
  background: vars.color.surface,
  padding: "1.25em",
  border: `1px solid ${vars.color.border}`,
  maxWidth: "300px",
  width: "100%",
  textAlign: "center"
});

export const title = style({
  fontSize: "0.9rem",
  fontWeight: 600,
  margin: "0 0 0.5em"
});

export const message = style({
  fontSize: "0.85rem",
  margin: "0 0 1em",
  color: vars.color.text
});

export const actions = style({
  display: "flex",
  gap: "0.5em",
  justifyContent: "center"
});

const actionButtonBase = style({
  padding: "0.4em 1em",
  border: `1px solid ${vars.color.border}`,
  cursor: "pointer",
  fontSize: "0.8rem",
  transition: "all 0.15s"
});

export const cancelButton = style([
  actionButtonBase,
  {
    background: vars.color.surface,
    color: vars.color.text,
    selectors: {
      "&:hover": {
        background: vars.color.hoverBg,
        color: vars.color.hoverText
      }
    }
  }
]);

export const confirmButton = style([
  actionButtonBase,
  {
    background: vars.color.accent,
    color: vars.color.accentText,
    borderColor: vars.color.accent
  }
]);
