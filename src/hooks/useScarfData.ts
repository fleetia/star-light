import { useMemo } from "react";
import type {
  Game,
  RowMode,
  ScarfColors,
  ScarfRow,
  SeriesType,
  TeamCode
} from "../types/game.types";
import {
  getTeamGames,
  buildScarfRows,
  expandScarfRows,
  countResults
} from "../utils/gameUtils";

type ScarfData = {
  scarfRows: ScarfRow[];
  rowKeys: string[];
  wins: number;
  draws: number;
  losses: number;
  cancels: number;
};

export function useScarfData(
  games: Game[],
  team: TeamCode,
  series: SeriesType[],
  colors: ScarfColors,
  rowMode: RowMode,
  rowCount: number,
  cancelRowCount: number
): ScarfData {
  const filteredGames = useMemo(
    () => getTeamGames(games, team, series),
    [games, team, series]
  );

  const baseScarfRows = useMemo(
    () => buildScarfRows(filteredGames, team, colors),
    [filteredGames, team, colors]
  );

  const scarfRows = useMemo(
    () => expandScarfRows(baseScarfRows, rowMode, rowCount, cancelRowCount),
    [baseScarfRows, rowMode, rowCount, cancelRowCount]
  );

  const { wins, draws, losses, cancels } = useMemo(
    () => countResults(baseScarfRows),
    [baseScarfRows]
  );

  const rowKeys = useMemo(() => scarfRows.map(r => r.rowKey), [scarfRows]);

  return { scarfRows, rowKeys, wins, draws, losses, cancels };
}
