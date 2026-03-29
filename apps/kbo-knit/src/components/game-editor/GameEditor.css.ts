import { style } from "@vanilla-extract/css";
import { vars } from "../../styles/theme.css";

export const addButton = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.4rem",
  width: "100%",
  padding: "0.6rem",
  background: "none",
  border: `1px dashed ${vars.color.text}`,
  borderRadius: "4px",
  color: vars.color.text,
  fontSize: vars.fontSize.md,
  cursor: "pointer",
  transition: "all 0.15s",
  ":hover": {
    background: vars.color.text,
    color: vars.color.white
  }
});

export const form = style({
  display: "grid",
  gap: "0.8rem"
});

export const row = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "0.6rem"
});

export const submitButton = style({
  padding: "0.5rem 1rem",
  background: vars.color.text,
  color: vars.color.white,
  border: "none",
  borderRadius: "4px",
  fontSize: vars.fontSize.md,
  cursor: "pointer",
  fontWeight: 600,
  transition: "opacity 0.15s",
  ":hover": {
    opacity: 0.85
  },
  ":disabled": {
    opacity: 0.3,
    cursor: "not-allowed"
  }
});

export const list = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.4rem",
  marginTop: "0.5rem"
});

export const listItem = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.5rem 0.6rem",
  border: `1px solid ${vars.color.text}`,
  borderRadius: "4px",
  fontSize: vars.fontSize.md
});

export const listInfo = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.15rem"
});

export const listDate = style({
  fontSize: vars.fontSize.sm,
  color: vars.color.textLight
});

export const deleteButton = style({
  background: "none",
  border: "none",
  color: vars.color.text,
  cursor: "pointer",
  fontSize: vars.fontSize.lg,
  padding: "0.2rem 0.4rem",
  ":hover": {
    color: vars.color.error
  }
});

export const divider = style({
  borderTop: `1px solid ${vars.color.text}`,
  margin: "0.5rem 0",
  padding: 0
});

export const sectionTitle = style({
  fontSize: vars.fontSize.sm,
  fontWeight: 600,
  color: vars.color.text,
  margin: 0
});
