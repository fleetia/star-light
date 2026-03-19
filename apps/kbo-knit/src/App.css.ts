import { style } from "@vanilla-extract/css";
import { vars } from "./styles/theme.css";

export const app = style({
  display: "grid",
  gap: "1rem",
  maxWidth: "100%",
  margin: "0 auto",
  padding: "1rem",
  "@media": {
    "(min-width: 768px)": { maxWidth: 768, padding: "2rem", gap: "1.2rem" }
  }
});

export const title = style({
  fontSize: vars.fontSize["4xl"],
  letterSpacing: "normal",
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize["5xl"] }
  }
});

export const subtitle = style({
  color: vars.color.textMuted,
  fontSize: vars.fontSize.md,
  marginTop: "-0.8rem",
  "@media": {
    "(min-width: 768px)": { fontSize: vars.fontSize.xl }
  }
});

export const settings = style({
  display: "grid",
  gap: "0.8rem",
  "@media": {
    "(min-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fit, minmax(0, 1fr))",
      gap: "1rem"
    }
  }
});

export const loading = style({
  textAlign: "center",
  color: vars.color.textMuted,
  padding: "2rem 0",
  fontSize: vars.fontSize.xl
});

export const error = style({
  textAlign: "center",
  color: vars.color.error,
  padding: "2rem 0",
  fontSize: vars.fontSize.xl
});

export const empty = style({
  textAlign: "center",
  color: vars.color.textPlaceholder,
  padding: "3rem 0",
  fontSize: vars.fontSize.xl
});

export const footer = style({
  marginTop: "2rem",
  padding: "1.5rem 0",
  borderTop: `1px solid ${vars.color.border}`,
  textAlign: "center",
  fontSize: vars.fontSize.md,
  color: vars.color.textPlaceholder,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "0.5rem"
});

export const footerLink = style({
  color: vars.color.textPlaceholder,
  textDecoration: "none",
  ":hover": { color: vars.color.textLight }
});

export const footerCredits = style({
  lineHeight: 1.6
});
