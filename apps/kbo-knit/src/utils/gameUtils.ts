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

// 해당 날짜의 모든 경기가 0:0이면 아직 시작 전으로 간주
function getUnplayedDates(games: Game[]): Set<string> {
  const dateScores = new Map<string, boolean>();
  for (const g of games) {
    if (g.awayScore === null || g.homeScore === null) continue;
    const hasScore = g.awayScore !== 0 || g.homeScore !== 0;
    if (hasScore) {
      dateScores.set(g.date, true);
    } else if (!dateScores.has(g.date)) {
      dateScores.set(g.date, false);
    }
  }
  const dates = new Set<string>();
  for (const [date, hasScore] of dateScores) {
    if (!hasScore) dates.add(date);
  }
  return dates;
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
        g.awayScore !== null &&
        g.homeScore !== null &&
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

  if (myScore > opScore) {
    return { isHome, result: "win", myScore, opScore };
  }
  if (myScore < opScore) {
    return { isHome, result: "loss", myScore, opScore };
  }
  return { isHome, result: "draw", myScore, opScore };
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
  // perDiff
  return Math.max(1, Math.abs(my - op) * count);
}

export function expandScarfRows(
  rows: ScarfRow[],
  mode: RowMode,
  count: number
): ScarfRow[] {
  if (mode === "perGame" && count === 1) return rows;

  const result: ScarfRow[] = [];
  for (const row of rows) {
    const n = getRowRepeat(row, mode, count);
    for (let i = 0; i < n; i++) {
      result.push({
        ...row,
        rowKey: n > 1 ? `${row.gameKey}-${i}` : row.gameKey
      });
    }
  }
  return result;
}

export function countResults(rows: ScarfRow[]): {
  wins: number;
  draws: number;
  losses: number;
} {
  return rows.reduce(
    (acc, r) => {
      if (r.result === "win") {
        return { ...acc, wins: acc.wins + 1 };
      }
      if (r.result === "draw") {
        return { ...acc, draws: acc.draws + 1 };
      }
      return { ...acc, losses: acc.losses + 1 };
    },
    { wins: 0, draws: 0, losses: 0 }
  );
}
