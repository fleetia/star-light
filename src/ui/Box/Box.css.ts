import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const container = style({
  border: `1px solid ${vars.color.border}`,
  padding: "0.5em 0.75em 0.75em",
  background: vars.color.surface
});

export const header = style({
  display: "grid",
  alignItems: "center",
  gap: "0.25em",
  marginBottom: "0.6em"
});

export const title = style({
  fontWeight: 600,
  fontSize: 16,
  color: "#000"
});

export const subtitle = style({
  fontSize: "0.75rem",
  color: vars.color.muted
});
