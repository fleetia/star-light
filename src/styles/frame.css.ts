import { globalStyle, style } from "@vanilla-extract/css";
import { themeVars } from "@fleetia/lagrange/theme";

export const frame = style({
  border: `1px solid ${themeVars.semantic.color.border.strong}`,
  backgroundColor: themeVars.semantic.color.surface.raised
});

export const fieldFrame = style([frame]);

globalStyle(`${fieldFrame} > legend`, {
  float: "left",
  marginBottom: themeVars.semantic.space.sm
});
globalStyle(`${fieldFrame} > legend + *`, {
  clear: "both",
  marginTop: 0
});
