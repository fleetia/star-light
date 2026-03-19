import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const tree = style({
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  minHeight: "112px",
  maxHeight: "400px",
  overflowY: "auto"
});

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "4px 8px",
  width: "100%",
  border: "none",
  borderBottom: "1px solid transparent",
  background: "none",
  cursor: "default",
  fontSize: "0.8rem",
  color: vars.color.text,
  transition: "background 0.1s, opacity 0.15s",
  selectors: {
    "&:hover": {
      background: vars.color.hoverBg,
      color: vars.color.hoverText
    }
  }
});

export const rowDraggable = style({
  cursor: "grab",
  selectors: {
    "&:active": {
      cursor: "grabbing"
    }
  }
});

export const rowDragOver = style({
  borderBottomColor: vars.color.accent
});

export const rowHidden = style({
  opacity: 0.45
});

export const expandButton = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "0.55rem",
  width: "16px",
  textAlign: "center",
  padding: 0,
  color: vars.color.muted,
  flexShrink: 0,
  lineHeight: "1"
});

export const expandPlaceholder = style({
  width: "16px",
  flexShrink: 0
});

export const itemLabel = style({
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  textAlign: "left",
  fontSize: "inherit",
  color: "inherit"
});

export const actionButton = style({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: "2px",
  color: vars.color.muted,
  transition: "color 0.15s",
  selectors: {
    "&:hover": {
      color: vars.color.text
    }
  }
});

export const dragHandle = style({
  flexShrink: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: vars.color.muted,
  cursor: "grab",
  padding: "0 2px",
  selectors: {
    "&:active": {
      cursor: "grabbing"
    }
  }
});
