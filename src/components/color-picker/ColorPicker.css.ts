import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const group = style({
  position: "relative",
  borderRadius: vars.radius.lg,
  padding: "1rem",
  "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
});

export const sectionLabel = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textPlaceholder,
  paddingBottom: 4,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: 4
});

export const toggleRow = style({
  position: "absolute",
  top: "1rem",
  right: "1rem",
  "@media": {
    "(min-width: 768px)": { top: "1.2rem", right: "1.5rem" }
  }
});

export const splitRow = style({
  display: "flex",
  gap: "1.5rem",
  paddingTop: "0.6em"
});

export const section = style({
  flex: 1
});
