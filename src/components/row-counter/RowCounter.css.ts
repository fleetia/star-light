import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.2rem",
  padding: "0.5rem 0"
});

export const toggleSection = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.6rem"
});

export const toggleLabel = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textPlaceholder,
  transition: "color 0.15s",
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.md }
  }
});

export const toggleLabelActive = style({
  color: vars.color.text,
  fontWeight: 600
});

export const colorDisplay = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.5rem",
  fontSize: vars.fontSize.lg,
  color: vars.color.textLight,
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.xl }
  }
});

export const swatch = style({
  display: "inline-block",
  width: 28,
  height: 28,
  borderRadius: vars.radius.sm,
  border: "1px solid rgba(0, 0, 0, 0.1)",
  flexShrink: 0,
  "@media": {
    "(min-width: 768px)": { width: 32, height: 32 }
  }
});

export const counterSection = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.4rem",
  padding: "1rem 0"
});

export const counterRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "1.2rem"
});

export const counterButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 48,
  height: 48,
  borderRadius: "50%",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.white,
  fontSize: "1.4rem",
  color: vars.color.text,
  cursor: "pointer",
  transition: "background 0.1s",
  userSelect: "none",
  ":hover": { background: vars.color.hoverBg },
  ":disabled": {
    opacity: 0.3,
    cursor: "default"
  },
  "@media": {
    "(min-width: 768px)": { width: 52, height: 52 }
  }
});

export const counterValue = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: 120,
  cursor: "pointer",
  userSelect: "none"
});

export const counterNum = style({
  fontSize: "2.5rem",
  fontWeight: 700,
  lineHeight: 1.1,
  color: vars.color.text
});

export const counterUnit = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
  marginTop: "0.1rem"
});

export const totalText = style({
  fontSize: vars.fontSize.base,
  color: vars.color.textMuted,
  padding: "8px 0"
});

export const stitchSection = style({
  borderTop: `1px solid ${vars.color.border}`,
  paddingTop: "1rem",
  display: "flex",
  flexDirection: "column",
  gap: "0.6rem"
});

export const stockinetteRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
});

export const radioGroup = style({
  justifyContent: "center"
});

export const stitchType = style({
  textAlign: "center",
  fontSize: vars.fontSize.xl,
  fontWeight: 600,
  color: vars.color.text,
  padding: "0.3rem 0",
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize["2xl"] }
  }
});

export const counterButtonWrap = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.2rem"
});
