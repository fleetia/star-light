import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const wrapper = style({
  position: "relative",
  display: "inline-block"
});

export const trigger = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.35em",
  padding: "0.2em 0.4em",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  cursor: "pointer",
  fontSize: "0.75rem",
  fontFamily: "inherit",
  color: "inherit",
  transition: "all 0.15s",
  selectors: {
    "&:hover": {
      background: vars.color.hoverBg,
      color: vars.color.hoverText
    }
  }
});

export const swatch = style({
  display: "inline-block",
  width: "18px",
  height: "18px",
  border: `1px solid ${vars.color.border}`,
  flexShrink: 0
});

export const panel = style({
  position: "fixed",
  zIndex: 10000,
  width: "240px",
  padding: "0.75em",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.12)"
});

export const canvasWrap = style({
  position: "relative",
  width: "100%",
  aspectRatio: "1",
  marginBottom: "0.5em"
});

globalStyle(`${canvasWrap} canvas`, {
  display: "block",
  width: "100%",
  height: "100%",
  cursor: "crosshair"
});

export const alphaSection = style({
  marginBottom: "0.5em"
});

export const alphaLabel = style({
  display: "block",
  fontSize: "0.7rem",
  marginBottom: "0.2em",
  color: vars.color.muted
});

export const alphaTrack = style({
  position: "relative",
  width: "100%",
  height: "14px",
  border: `1px solid ${vars.color.border}`,
  cursor: "pointer",
  backgroundImage:
    "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
  backgroundSize: "8px 8px",
  backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0",
  overflow: "hidden"
});

export const alphaGradient = style({
  position: "absolute",
  inset: 0
});

export const alphaThumb = style({
  position: "absolute",
  top: 0,
  width: "4px",
  height: "100%",
  background: "#fff",
  border: "1px solid #999",
  transform: "translateX(-50%)",
  pointerEvents: "none"
});

export const formatRow = style({
  display: "flex",
  gap: "0.35em",
  marginBottom: "0.4em"
});

export const formatButton = style({
  flex: 1,
  padding: "0.2em",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  cursor: "pointer",
  fontSize: "0.65rem",
  fontFamily: "inherit",
  transition: "all 0.15s"
});

export const formatButtonActive = style({
  background: vars.color.accent,
  color: vars.color.accentText,
  borderColor: vars.color.accent
});

export const inputRow = style({
  display: "flex",
  gap: "0.25em"
});

export const fieldGroup = style({
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.1em"
});

export const fieldInput = style({
  width: "100%",
  padding: "0.2em 0.3em",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontSize: "0.7rem",
  fontFamily: "inherit",
  textAlign: "center",
  color: "inherit",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 1px ${vars.color.accent}`
    }
  }
});

export const fieldLabel = style({
  fontSize: "0.6rem",
  color: vars.color.muted
});

export const backdrop = style({
  position: "fixed",
  inset: 0,
  zIndex: 9999
});

export const nativeInput = style({
  position: "absolute",
  width: 0,
  height: 0,
  padding: 0,
  border: "none",
  overflow: "hidden",
  opacity: 0,
  pointerEvents: "none"
});
