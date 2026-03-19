import { useState, useEffect } from "react";
import type { Game, KboData } from "../types/game.types";

type UseKboDataReturn = {
  games: Game[];
  isLoading: boolean;
  error: string | null;
};

export function useKboData(season: number): UseKboDataReturn {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setError(null);

    fetch(`/data/${season}.json`, { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`${season}년 데이터가 없습니다`);
        }
        return res.json() as Promise<KboData>;
      })
      .then(data => {
        setGames(data.games as Game[]);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        if (err.name === "AbortError") return;
        setGames([]);
        setError(err.message);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [season]);

  return { games, isLoading, error };
}
