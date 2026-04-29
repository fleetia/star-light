import type { AppState } from "../types/game.types";

export const CURRENT_YEAR = new Date().getFullYear();

export const DEFAULT_STATE: AppState = {
  season: CURRENT_YEAR,
  team: "HANWHA",
  awaySame: true,
  series: ["REGULAR_SEASON"],
  colors: {
    homeWin: "#FF6600",
    homeDraw: "#aab7b8",
    homeLoss: "#000000",
    homeCancel: "#7f8c8d",
    awayWin: "#2e86c1",
    awayDraw: "#d5dbdb",
    awayLoss: "#e74c3c",
    awayCancel: "#bdc3c7"
  },
  checked: {},
  rowMode: "perGame",
  rowCount: 1,
  cancelRowCount: 0,
  customGames: []
};

export const STORAGE_KEY = "kbo-knit";
