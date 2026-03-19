import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const positionWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "4px",
  margin: "0.4em 0"
});

export const positionGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "4px",
  width: "80px"
});

export const positionCell = style({
  aspectRatio: "1",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  cursor: "pointer",
  transition: "all 0.15s",
  padding: 0,
  selectors: {
    "&:hover": {
      background: vars.color.hoverBg
    }
  }
});

export const positionActive = style({
  background: vars.color.accent,
  borderColor: vars.color.accent
});

export const marginTop = style({
  display: "flex",
  alignItems: "center",
  gap: "2px"
});

export const marginBottom = style({
  display: "flex",
  alignItems: "center",
  gap: "2px"
});

export const marginMiddle = style({
  display: "flex",
  alignItems: "center",
  gap: "4px"
});

export const marginSide = style({
  display: "flex",
  alignItems: "center",
  gap: "2px"
});

export const marginInput = style({
  width: "42px",
  padding: "2px 4px",
  border: `1px solid ${vars.color.border}`,
  background: vars.color.surface,
  fontSize: "0.7rem",
  textAlign: "center",
  color: "inherit",
  MozAppearance: "textfield",
  selectors: {
    "&:focus": {
      outline: "none",
      boxShadow: `0 0 0 1px ${vars.color.accent}`
    }
  }
});

globalStyle(
  `${marginInput}::-webkit-outer-spin-button, ${marginInput}::-webkit-inner-spin-button`,
  {
    WebkitAppearance: "none",
    margin: 0
  }
);

export const marginUnit = style({
  fontSize: "0.65rem",
  color: vars.color.muted
});
