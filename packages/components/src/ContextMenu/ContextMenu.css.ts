import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const contextMenu = style({
  position: "fixed",
  background: vars.color.surface,
  border: `1px solid ${vars.color.border}`,
  zIndex: 1000,
  overflow: "hidden",
  minWidth: "120px"
});

export const contextMenuItem = style({
  width: "100%",
  padding: "10px 14px",
  border: "none",
  borderBottom: "1px solid rgba(0, 0, 0, 0.08)",
  background: vars.color.surface,
  color: vars.color.text,
  fontSize: "0.85rem",
  textAlign: "left",
  cursor: "pointer",
  transition: "all 0.15s",
  selectors: {
    "&:last-child": {
      borderBottom: "none"
    },
    "&:hover": {
      background: vars.color.hoverBg,
      color: vars.color.hoverText
    }
  }
});

export const deleteVariant = style({
  color: "red",
  selectors: {
    "&:hover": {
      background: "red",
      color: "white"
    }
  }
});
