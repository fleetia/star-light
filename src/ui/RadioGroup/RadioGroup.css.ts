import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const group = style({
  display: "flex",
  alignItems: "center",
  gap: "1em"
});

export const label = style({
  display: "flex",
  alignItems: "center",
  gap: "0.3em",
  cursor: "pointer",
  fontSize: "0.8rem",
  color: vars.color.text,
  userSelect: "none",
  selectors: {
    "&[data-disabled]": {
      opacity: 0.5,
      cursor: "default"
    }
  }
});

export const input = style({
  accentColor: vars.color.accent,
  cursor: "pointer",
  margin: 0,
  selectors: {
    [`${label}[data-disabled] &`]: {
      cursor: "default"
    }
  }
});
