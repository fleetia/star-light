export type TeamCode =
  | "SAMSUNG"
  | "KIWOOM"
  | "LG"
  | "DOOSAN"
  | "KIA"
  | "NC"
  | "HANWHA"
  | "SSG"
  | "KT"
  | "LOTTE";

export type SeriesType = "PRESEASON" | "REGULAR_SEASON" | "POSTSEASON";

export type GameResult = "win" | "draw" | "loss";

export type Game = {
  gameKey: string;
  seriesType: SeriesType;
  date: string;
  awayTeam: TeamCode;
  homeTeam: TeamCode;
  awayScore: number | null;
  homeScore: number | null;
};

export type KboData = {
  season: number;
  games: Game[];
};

export type ColorSet = {
  win: string;
  draw: string;
  loss: string;
};

export type ScarfColors = {
  home: ColorSet;
  away: ColorSet;
};

export type ScarfRow = {
  gameKey: string;
  rowKey: string;
  color: string;
  result: GameResult;
  isHome: boolean;
  date: string;
  opponent: string;
  score: string;
  prefix: "H" | "A";
};

export type RowMode = "perGame" | "perScore" | "perOpScore" | "perDiff";

export type TabKey = "pattern" | "guide" | "counter";

export type CheckTiming = "start" | "end";

export type AppState = {
  activeTab?: TabKey;
  checkTiming?: CheckTiming;
  stockinetteEnabled?: boolean;
  stockinetteOddKnit?: boolean;
  season: number;
  team: TeamCode;
  awaySame: boolean;
  series: SeriesType[];
  colors: {
    homeWin: string;
    homeDraw: string;
    homeLoss: string;
    awayWin: string;
    awayDraw: string;
    awayLoss: string;
  };
  checked: Record<string, boolean>;
  checkedMap?: Record<string, Record<string, boolean>>;
  rowMode: RowMode;
  rowCount: number;
  customGames: Game[];
};
