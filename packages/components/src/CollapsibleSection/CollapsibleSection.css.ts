import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const item = style({
  border: `1px solid ${vars.color.border}`,
  padding: "0.5em 0.75em 0.75em",
  background: vars.color.surface,
  marginBottom: "0.5em"
});

export const title = style({
  display: "block",
  width: "100%",
  fontWeight: 600,
  fontSize: "0.85rem",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  textAlign: "left",
  color: "inherit"
});

export const body = style({
  paddingTop: "0.75em"
});
