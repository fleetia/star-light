import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const breadcrumb = style({
  display: "flex",
  alignItems: "center",
  gap: "0.25em",
  flexWrap: "wrap"
});

export const breadcrumbItem = style({
  background: "none",
  border: "none",
  color: vars.color.muted,
  fontSize: "0.85em",
  cursor: "pointer",
  padding: 0,
  selectors: {
    "&:hover": {
      color: vars.color.accent
    }
  }
});

export const breadcrumbItemActive = style({
  color: "var(--heading-title-color, var(--c-text))",
  fontSize: "var(--heading-title-size, inherit)",
  fontWeight: 600,
  WebkitTextStroke: "var(--heading-text-stroke, 0 transparent)",
  paintOrder: "stroke fill"
});

export const breadcrumbSeparator = style({
  color: vars.color.muted,
  fontSize: "0.75em"
});
