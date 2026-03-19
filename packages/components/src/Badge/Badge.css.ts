import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

const base = style({
  display: "inline-block",
  padding: "0.2em 0.6em",
  fontSize: "0.75rem",
  fontWeight: 500,
  textAlign: "center",
  whiteSpace: "nowrap",
  border: `1px solid ${vars.color.border}`
});

export const variant = styleVariants({
  active: [
    base,
    {
      background: vars.color.accent,
      color: vars.color.accentText,
      borderColor: vars.color.accent
    }
  ],
  inactive: [
    base,
    {
      background: vars.color.surface,
      color: vars.color.text
    }
  ],
  default: [
    base,
    {
      background: "rgba(0, 0, 0, 0.04)",
      color: vars.color.muted
    }
  ]
});
