import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { fieldFrame } from "../../styles/frame.css";

export const group = style([
  fieldFrame,
  {
    position: "relative",
    borderRadius: vars.radius.lg,
    padding: "1rem",
    "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
  }
]);

export const sectionLabel = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textPlaceholder,
  paddingBottom: 4,
  borderBottom: `1px solid ${vars.color.border}`,
  marginBottom: 4
});

export const toggleRow = style({
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "0.5rem"
});

export const splitRow = style({
  display: "flex",
  gap: "1.5rem",
  paddingTop: "0.6em"
});

export const section = style({
  flex: 1
});

export const colorRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "0.5rem",
  padding: "0.3em 0"
});
