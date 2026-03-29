import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const wrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5em",
  cursor: "pointer",
  selectors: {
    "&[data-disabled]": {
      opacity: 0.5,
      cursor: "default"
    }
  }
});

export const track = style({
  position: "relative",
  width: "36px",
  height: "20px",
  borderRadius: "10px",
  background: vars.color.muted,
  border: "none",
  cursor: "pointer",
  padding: 0,
  transition: "background 0.2s",
  flexShrink: 0,
  selectors: {
    "&[data-checked]": {
      background: vars.color.accent
    },
    [`${wrapper}[data-disabled] &`]: {
      cursor: "default"
    }
  }
});

export const thumb = style({
  position: "absolute",
  top: "2px",
  left: "2px",
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  background: vars.color.surface,
  transition: "transform 0.2s",
  selectors: {
    [`${track}[data-checked] &`]: {
      transform: "translateX(16px)"
    }
  }
});

export const label = style({
  fontSize: "0.8rem",
  color: vars.color.text,
  userSelect: "none"
});
