import type { TeamCode } from "../types/game.types";

export const TEAM_NAMES: Record<TeamCode, string> = {
  SAMSUNG: "삼성 라이온즈",
  LG: "LG 트윈스",
  DOOSAN: "두산 베어스",
  LOTTE: "롯데 자이언츠",
  KIA: "KIA 타이거즈",
  HANWHA: "한화 이글스",
  SSG: "SSG 랜더스",
  KIWOOM: "키움 히어로즈",
  NC: "NC 다이노스",
  KT: "KT 위즈"
};

export const TEAM_COLORS: Record<
  TeamCode,
  { win: string; draw: string; loss: string }
> = {
  SAMSUNG: { win: "#074CA1", draw: "#aab7b8", loss: "#FFFFFF" },
  LG: { win: "#C30037", draw: "#aab7b8", loss: "#000000" },
  DOOSAN: { win: "#131230", draw: "#C0392B", loss: "#FFFFFF" },
  LOTTE: { win: "#041E42", draw: "#D00F31", loss: "#aab7b8" },
  KIA: { win: "#EA0029", draw: "#aab7b8", loss: "#000000" },
  HANWHA: { win: "#FF6600", draw: "#aab7b8", loss: "#000000" },
  SSG: { win: "#CE0E2D", draw: "#FFB81C", loss: "#aab7b8" },
  KIWOOM: { win: "#820024", draw: "#aab7b8", loss: "#000000" },
  NC: { win: "#315288", draw: "#C5A052", loss: "#aab7b8" },
  KT: { win: "#000000", draw: "#aab7b8", loss: "#EB1F25" }
};

export const TEAM_CODES = Object.keys(TEAM_NAMES) as TeamCode[];

export const RESULT_LABELS: Record<string, string> = {
  win: "승",
  draw: "무",
  loss: "패"
};
