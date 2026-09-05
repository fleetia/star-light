import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const group = style({
  display: "flex",
  flexDirection: "column",
  borderRadius: vars.radius.lg,
  padding: "1rem",
  "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
});

export const filters = style({
  display: "flex",
  gap: "0.4rem",
  marginTop: "auto",
  marginBottom: "auto"
});

export const btn = style({
  flex: 1,
  "@media": {
    "(min-width: 768px)": { flex: "none" }
  }
});
