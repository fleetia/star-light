import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const pageButton = style({
  cursor: "pointer",
  border: `1px solid ${vars.color.border}`,
  height: "fit-content",
  background: vars.color.surface,
  color: vars.color.text,
  padding: "4px",
  transition: "all 0.15s",
  selectors: {
    "&:hover": {
      background: vars.color.hoverBg,
      color: vars.color.hoverText
    }
  }
});
