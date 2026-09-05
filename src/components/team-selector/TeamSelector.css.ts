import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const group = style({
  borderRadius: vars.radius.lg,
  padding: "1rem",
  "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
});
