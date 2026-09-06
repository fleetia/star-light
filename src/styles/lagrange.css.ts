import { createTheme, globalStyle } from "@vanilla-extract/css";
import {
  createSelectIndicatorTexture,
  createThemeTokens,
  primitiveTokens,
  themeVars
} from "@fleetia/lagrange/theme";

const canvasBackground = `color-mix(in srgb, ${primitiveTokens.palette.paperRaised} 82%, ${primitiveTokens.palette.inkMuted})`;

globalStyle("body", { backgroundColor: canvasBackground });

export const kboTheme = createTheme(
  themeVars,
  createThemeTokens({
    semantic: {
      color: {
        surface: {
          canvas: canvasBackground,
          raised: "#ffffff",
          muted: "#f5f5f5"
        },
        content: {
          primary: "#333333",
          secondary: "#555555",
          accent: "#000000",
          onAccent: "#ffffff"
        },
        border: { strong: "#333333", subtle: "#dddddd" },
        interaction: {
          primary: "#000000",
          primaryHover: "#333333",
          focus: "#4a90d9",
          focusSurface: "#edf4fb"
        },
        selection: { indicator: "#000000", surface: "#f0f0f0" },
        status: {
          positive: "#286642",
          positiveSurface: "#edf5ef",
          critical: "#c0392b",
          criticalSurface: "#fbeeed"
        }
      },
      typography: {
        family: {
          display:
            '"KboDiamondGothic", "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          ui: '"KboDiamondGothic", "Pretendard", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }
      },
      dimension: { control: "2.5rem", row: "2rem" },
      material: { canvasTexture: "none" }
    },
    component: {
      control: { selectIndicator: createSelectIndicatorTexture("#333333") }
    }
  })
);
