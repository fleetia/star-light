import { style, styleVariants } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

const base = style({
  cursor: "pointer",
  fontWeight: 500,
  borderRadius: 4,
  transition: "all 0.15s",
  border: `1px solid ${vars.color.border}`,
  selectors: {
    "&:disabled": {
      opacity: 0.4,
      cursor: "default"
    }
  }
});

export const size = styleVariants({
  sm: [base, { padding: "0.3em 0.6em", fontSize: "0.75rem" }],
  md: [base, { padding: "0.4em 1em", fontSize: "0.8rem" }]
});

export const variant = styleVariants({
  primary: {
    background: vars.color.accent,
    color: vars.color.accentText,
    borderColor: vars.color.accent
  },
  secondary: {
    background: vars.color.surface,
    color: vars.color.text,
    "@media": {
      "(hover: hover)": {
        selectors: {
          "&:hover:not(:disabled)": {
            background: vars.color.hoverBg,
            color: vars.color.hoverText
          }
        }
      }
    }
  },
  ghost: {
    background: "transparent",
    color: vars.color.text,
    borderColor: "transparent",
    "@media": {
      "(hover: hover)": {
        selectors: {
          "&:hover:not(:disabled)": {
            background: "rgba(0, 0, 0, 0.04)"
          }
        }
      }
    }
  },
  danger: {
    background: "#dc3545",
    color: "#ffffff",
    borderColor: "#dc3545",
    "@media": {
      "(hover: hover)": {
        selectors: {
          "&:hover:not(:disabled)": {
            background: "#c82333",
            borderColor: "#c82333"
          }
        }
      }
    }
  }
});
