import { style } from "@vanilla-extract/css";
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

export const input = style({
  width: "100%",
  padding: "0.4em 0.5em",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontSize: "0.8rem",
  color: vars.color.text,
  boxSizing: "border-box",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 1px ${vars.color.accent}`
    },
    "&::placeholder": {
      color: vars.color.muted
    }
  }
});

export const inputError = style({
  borderColor: "#dc3545",
  selectors: {
    "&:focus": {
      boxShadow: "0 0 0 1px #dc3545"
    }
  }
});

export const error = style({
  fontSize: "0.75rem",
  color: "#dc3545"
});
