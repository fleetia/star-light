import type {
  Game,
  GameResult,
  RowMode,
  ScarfColors,
  ScarfRow,
  SeriesType,
  TeamCode
} from "../types/game.types";
import { TEAM_NAMES } from "../constants/teams";

const hasValidScore = (g: Game) => g.awayScore !== null && g.homeScore !== null;

const hasNonZeroScore = (g: Game) => g.awayScore !== 0 || g.homeScore !== 0;

export const getMatchupKey = (g: {
  date: string;
  awayTeam: string;
  homeTeam: string;
}) => `${g.date}-${g.awayTeam}-${g.homeTeam}`;

export const getRealMatchups = (games: Game[]) =>
  new Set(games.filter(hasValidScore).map(getMatchupKey));

function getUnplayedDates(games: Game[]): Set<string> {
  const validGames = games.filter(hasValidScore);
  const scoredDates = new Set(
    validGames.filter(hasNonZeroScore).map(g => g.date)
  );
  const zeroDates = new Set(
    validGames.filter(g => !hasNonZeroScore(g)).map(g => g.date)
  );
  return new Set([...zeroDates].filter(d => !scoredDates.has(d)));
}

export function getTeamGames(
  games: Game[],
  teamCode: TeamCode,
  seriesFilter: SeriesType[]
): Game[] {
  const unplayed = getUnplayedDates(games);

  return games
    .filter(
      g =>
        (g.homeTeam === teamCode || g.awayTeam === teamCode) &&
        seriesFilter.includes(g.seriesType) &&
        hasValidScore(g) &&
        !unplayed.has(g.date)
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getGameResult(
  game: Game,
  teamCode: TeamCode
): {
  isHome: boolean;
  result: GameResult;
  myScore: number;
  opScore: number;
} {
  const isHome = game.homeTeam === teamCode;
  const myScore = (isHome ? game.homeScore : game.awayScore) ?? 0;
  const opScore = (isHome ? game.awayScore : game.homeScore) ?? 0;
  const result: GameResult =
    myScore > opScore ? "win" : myScore < opScore ? "loss" : "draw";

  return { isHome, result, myScore, opScore };
}

export function buildScarfRows(
  games: Game[],
  teamCode: TeamCode,
  colors: ScarfColors
): ScarfRow[] {
  return games.map(game => {
    const { isHome, result, myScore, opScore } = getGameResult(game, teamCode);
    const colorSet = isHome ? colors.home : colors.away;
    const opponent = isHome ? game.awayTeam : game.homeTeam;

    return {
      gameKey: game.gameKey,
      rowKey: game.gameKey,
      color: colorSet[result],
      result,
      isHome,
      date: game.date,
      opponent: TEAM_NAMES[opponent] ?? opponent,
      score: `${myScore}:${opScore}`,
      prefix: isHome ? ("H" as const) : ("A" as const)
    };
  });
}

function getRowRepeat(row: ScarfRow, mode: RowMode, count: number): number {
  if (mode === "perGame") return count;

  const [my, op] = row.score.split(":").map(Number);
  if (mode === "perScore") return Math.max(1, my * count);
  if (mode === "perOpScore") return Math.max(1, (my > op ? my : op) * count);
  return Math.max(1, Math.abs(my - op) * count);
}

export function expandScarfRows(
  rows: ScarfRow[],
  mode: RowMode,
  count: number
): ScarfRow[] {
  if (mode === "perGame" && count === 1) return rows;

  return rows.flatMap(row => {
    const n = getRowRepeat(row, mode, count);
    return Array.from({ length: n }, (_, i) => ({
      ...row,
      rowKey: n > 1 ? `${row.gameKey}-${i}` : row.gameKey
    }));
  });
}

const resultKey = { win: "wins", draw: "draws", loss: "losses" } as const;

export function countResults(rows: ScarfRow[]): {
  wins: number;
  draws: number;
  losses: number;
} {
  return rows.reduce(
    (acc, r) => ({
      ...acc,
      [resultKey[r.result]]: acc[resultKey[r.result]] + 1
    }),
    { wins: 0, draws: 0, losses: 0 }
  );
}
