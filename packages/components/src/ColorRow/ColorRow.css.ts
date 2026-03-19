import { style, globalStyle } from "@vanilla-extract/css";

export const colorRow = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0.3em 0"
});

globalStyle(`${colorRow} span`, {
  fontSize: "0.8rem"
});
