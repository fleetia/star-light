import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const wrapper = style({});

export const container = styleVariants({
  primary: {
    display: "flex",
    flexDirection: "row"
  },
  secondary: {
    display: "flex",
    flexDirection: "column",
    gap: "0.15em",
    padding: "0.75em 0.5em",
    border: `1px solid ${vars.color.border}`,
    minWidth: "90px",
    flexShrink: 0
  }
});

const tabBase = style({
  background: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.15s",
  color: vars.color.muted,
  selectors: {
    "&:hover": {
      color: vars.color.text
    }
  }
});

export const tab = styleVariants({
  primary: [
    tabBase,
    {
      padding: "0.45em 0.75em",
      borderRadius: "6px 6px 0 0",
      fontSize: "0.85rem",
      fontWeight: 500,
      borderBottom: `1px solid ${vars.color.border}`
    }
  ],
  secondary: [
    tabBase,
    {
      padding: "0.4em 0.65em",
      borderRadius: "5px",
      fontSize: "0.78rem",
      fontWeight: 500,
      textAlign: "left" as const,
      whiteSpace: "nowrap" as const,
      selectors: {
        "&:hover": {
          color: vars.color.text,
          background: "rgba(0, 0, 0, 0.04)"
        }
      }
    }
  ]
});

export const tabActive = styleVariants({
  primary: {
    color: vars.color.text,
    fontWeight: 700,
    background: vars.color.surface,
    flex: 1,
    border: `1px solid ${vars.color.border}`,
    borderBottom: "none"
  },
  secondary: {
    color: vars.color.text,
    fontWeight: 700,
    background: "rgba(0, 0, 0, 0.06)"
  }
});

export const panel = style({
  border: `1px solid ${vars.color.border}`,
  borderTop: "none",
  padding: "1em",
  background: "#fff"
});
