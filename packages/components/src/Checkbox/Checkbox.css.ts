import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "0.25em",
  cursor: "pointer",
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
  selectors: {
    [`${wrapper}[data-disabled] &`]: {
      cursor: "default"
    }
  }
});

export const label = style({
  fontSize: "0.8rem",
  color: vars.color.text,
  userSelect: "none"
});
