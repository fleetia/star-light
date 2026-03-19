import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const group = style({
  position: "relative",
  borderRadius: vars.radius.lg,
  padding: "1rem",
  "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
});

export const row = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem"
});

export const countInput = style({
  width: "3.5rem",
  textAlign: "center"
});
