import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25em"
});

export const label = style({
  fontSize: "0.8rem",
  fontWeight: 500,
  color: vars.color.text
});

export const base = style({
  width: "100%",
  cursor: "pointer",
  borderRadius: 4,
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  transition: "all 0.15s",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 1px ${vars.color.accent}`
    },
    "&:disabled": {
      opacity: 0.4,
      cursor: "default"
    }
  }
});

export const size = styleVariants({
  sm: [base, { padding: "0.3em 0.5em", fontSize: "0.75rem" }],
  md: [base, { padding: "0.4em 0.6em", fontSize: "0.8rem" }],
  lg: [base, { padding: "0.5em 0.8em", fontSize: "1rem" }]
});
