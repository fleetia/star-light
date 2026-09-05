import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({
  display: "grid",
  gap: "0.6rem",
  paddingBottom: "1rem",
  borderBottom: `1px solid ${vars.color.border}`
});
export const heading = style({ fontSize: vars.fontSize.xl });
export const status = style({ color: vars.color.textMuted, lineHeight: 1.6 });
export const actions = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center"
});
export const action = style({
  color: vars.color.text,
  textDecoration: "underline",
  textUnderlineOffset: "0.2em",
  cursor: "pointer",
  ":focus-visible": { outline: "2px solid currentColor", outlineOffset: 4 }
});
