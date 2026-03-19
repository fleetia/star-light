import { style } from "@vanilla-extract/css";
import { vars } from "../styles/tokens.css";

export const sidebar = style({
  position: "absolute",
  width: "100%",
  maxWidth: "380px",
  background: vars.color.surface,
  height: "100vh",
  overflowY: "auto",
  padding: "1.25em",
  color: vars.color.text
});

export const sidebarRight = style({
  right: 0,
  borderLeft: `1px solid ${vars.color.border}`
});

export const sidebarLeft = style({
  left: 0,
  borderRight: `1px solid ${vars.color.border}`
});
