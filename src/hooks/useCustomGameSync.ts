import { useEffect, useMemo } from "react";
import type { Game } from "../types/game.types";
import { getMatchupKey, getRealMatchups } from "../utils/gameUtils";

export function useCustomGameSync(
  games: Game[],
  customGames: Game[],
  season: number,
  removeCustomGame: (gameKey: string) => void
): Game[] {
  const seasonCustom = useMemo(
    () => customGames.filter(g => g.date.startsWith(String(season))),
    [customGames, season]
  );

  const realMatchups = useMemo(() => getRealMatchups(games), [games]);

  useEffect(() => {
    seasonCustom
      .filter(g => realMatchups.has(getMatchupKey(g)))
      .forEach(g => removeCustomGame(g.gameKey));
  }, [seasonCustom, realMatchups, removeCustomGame]);

  return useMemo(() => {
    const filtered = seasonCustom.filter(
      g => !realMatchups.has(getMatchupKey(g))
    );
    return filtered.length === 0 ? games : [...games, ...filtered];
  }, [games, seasonCustom, realMatchups]);
}
