import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";
import { fieldFrame } from "../../styles/frame.css";

export const group = style([
  fieldFrame,
  {
    borderRadius: vars.radius.lg,
    padding: "1rem",
    "@media": { "(min-width: 768px)": { padding: "1.2rem 1.5rem" } }
  }
]);
