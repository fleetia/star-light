import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const cardNav = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5em"
});

export const cardNavButton = style({
  cursor: "pointer",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  color: vars.color.text,
  padding: "2px 6px",
  lineHeight: 1,
  transition: "all 0.15s",
  selectors: {
    "&:hover:not(:disabled)": {
      background: vars.color.hoverBg,
      color: vars.color.hoverText
    },
    "&:disabled": {
      opacity: 0.3,
      cursor: "default"
    }
  }
});

export const cardNavIndicator = style({
  fontSize: "0.7em",
  color: vars.color.muted,
  minWidth: "2em",
  textAlign: "center"
});
