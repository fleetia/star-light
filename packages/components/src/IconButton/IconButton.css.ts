import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const IconButton = style({
  display: "grid",
  gridTemplateRows: "1fr 1fr",
  minWidth: `var(--icon-width, calc(4 * ${vars.em}))`,
  minHeight: `var(--icon-height, auto)`,
  border: `1px solid ${vars.color.border}`,
  placeItems: "center",
  gap: `calc(0.5 * ${vars.em})`,
  padding: `calc(0.5 * ${vars.em})`,
  borderRadius: `var(--icon-borderRadius, calc(0.3 * ${vars.em}))`,
  cursor: "pointer",
  transition:
    "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out, background-color 0.15s ease-in-out, color 0.15s ease-in-out",
  boxShadow: "0 0 0 transparent",
  backgroundColor: `var(--icon-color, ${vars.color.surface})`,
  selectors: {
    "&:hover": {
      transform: `translateY(calc(-0.3 * ${vars.em}))`,
      boxShadow: `0 calc(0.3 * ${vars.em}) 0 ${vars.color.accent}`,
      backgroundColor: vars.color.hoverBg,
      color: vars.color.hoverText
    }
  }
});

export const icon = style({
  borderRadius: `var(--icon-iconRadius, calc(0.4 * ${vars.em}))`,
  width: `min(${vars.iconSize}, calc(2 * ${vars.em}))`,
  height: `min(${vars.iconSize}, calc(2 * ${vars.em}))`,
  backgroundColor: vars.color.accent,
  color: vars.color.accentText,
  display: "grid",
  placeItems: "center",
  border: `1px solid ${vars.color.border}`,
  boxSizing: "content-box",
  overflow: "hidden"
});

export const hasIcon = style({
  backgroundColor: "transparent"
});

globalStyle(`${hasIcon} img`, {
  transform: "scale(1.1)"
});

export const name = style({
  color: vars.color.text,
  fontSize: `calc(0.75 * ${vars.em})`,
  wordBreak: "break-all",
  width: "100%",
  overflowX: "hidden",
  height: `calc(2 * ${vars.em})`,
  transition: "color 0.15s"
});

globalStyle(`${IconButton}:hover ${name}`, {
  color: vars.color.hoverText
});

export const horizontal = style({
  gridTemplateRows: "none",
  gridTemplateColumns: "auto 1fr"
});

globalStyle(`${horizontal} ${name}`, {
  textAlign: "left",
  height: "auto"
});

export const folder = style({
  backgroundColor: `var(--folder-color, var(--icon-color, ${vars.color.surface}))`,
  borderColor: `var(--folder-border, ${vars.color.border})`
});

globalStyle(`${folder} ${icon}`, {
  backgroundColor: `var(--folder-accent, ${vars.color.accent})`,
  color: `var(--folder-accent-text, ${vars.color.accentText})`,
  borderColor: `var(--folder-border, ${vars.color.border})`
});

globalStyle(`${folder} ${name}`, {
  color: `var(--folder-text, ${vars.color.text})`
});

export const empty = style({
  border: `1px dashed ${vars.color.border}`
});

globalStyle(`${empty} ${icon}`, {
  border: `1px solid ${vars.color.border}`,
  backgroundColor: vars.color.surface,
  color: vars.color.text
});
