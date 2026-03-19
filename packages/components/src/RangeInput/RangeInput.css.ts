import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const rangeInputWrapper = style({
  width: "100%"
});

export const settingLabel = style({
  display: "block",
  marginBottom: "0.4rem"
});

export const rangeLabel = style({
  fontSize: "0.8rem",
  fontWeight: 500
});

export const rangeInput = style({
  width: "100%",
  margin: "0.4rem 0",
  WebkitAppearance: "none",
  height: "2px",
  background: vars.color.accent,
  outline: "none"
});

globalStyle(`${rangeInput}::-webkit-slider-thumb`, {
  WebkitAppearance: "none",
  width: "14px",
  height: "14px",
  background: vars.color.accent,
  border: `2px solid ${vars.color.surface}`,
  borderRadius: "50%",
  cursor: "pointer",
  boxShadow: `0 0 0 1px ${vars.color.accent}`,
  transition: "all 0.15s"
});

globalStyle(`${rangeInput}::-webkit-slider-thumb:hover`, {
  transform: "scale(1.2)"
});
