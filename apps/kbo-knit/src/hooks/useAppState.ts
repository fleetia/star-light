import { useCallback, useMemo } from "react";
import type {
  AppState,
  CheckTiming,
  Game,
  RowMode,
  ScarfColors,
  SeriesType,
  TabKey,
  TeamCode
} from "../types/game.types";
import { TEAM_COLORS } from "../constants/teams";
import { DEFAULT_STATE, STORAGE_KEY } from "../constants/defaults";
import { useLocalStorage } from "./useLocalStorage";

type AppActions = {
  setSeason: (season: number) => void;
  setTeam: (team: TeamCode) => void;
  setAwaySame: (awaySame: boolean) => void;
  toggleSeries: (series: SeriesType) => void;
  setColor: (key: keyof AppState["colors"], value: string) => void;
  toggleChecked: (gameKey: string, allRowKeys?: string[]) => void;
  setRowMode: (mode: RowMode) => void;
  setRowCount: (count: number) => void;
  setActiveTab: (tab: TabKey) => void;
  setCheckTiming: (timing: CheckTiming) => void;
  setStockinetteEnabled: (enabled: boolean) => void;
  setStockinetteOddKnit: (oddKnit: boolean) => void;
  addCustomGame: (game: Game) => void;
  removeCustomGame: (gameKey: string) => void;
  scarfColors: ScarfColors;
};

export function useAppState(): [AppState, AppActions] {
  const [state, setState] = useLocalStorage<AppState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  const setSeason = useCallback(
    (season: number) =>
      setState(prev => {
        const prevKey = `${prev.season}-${prev.team}`;
        const nextKey = `${season}-${prev.team}`;
        const checkedMap = { ...prev.checkedMap, [prevKey]: prev.checked };
        return {
          ...prev,
          season,
          checked: checkedMap[nextKey] ?? {},
          checkedMap
        };
      }),
    [setState]
  );

  const setTeam = useCallback(
    (team: TeamCode) => {
      const tc = TEAM_COLORS[team];
      setState(prev => {
        const prevKey = `${prev.season}-${prev.team}`;
        const nextKey = `${prev.season}-${team}`;
        const checkedMap = { ...prev.checkedMap, [prevKey]: prev.checked };
        return {
          ...prev,
          team,
          colors: {
            ...prev.colors,
            homeWin: tc.win,
            homeDraw: tc.draw,
            homeLoss: tc.loss
          },
          checked: checkedMap[nextKey] ?? {},
          checkedMap
        };
      });
    },
    [setState]
  );

  const setAwaySame = useCallback(
    (awaySame: boolean) => setState(prev => ({ ...prev, awaySame })),
    [setState]
  );

  const toggleSeries = useCallback(
    (series: SeriesType) =>
      setState(prev => {
        const has = prev.series.includes(series);
        if (has && prev.series.length <= 1) return prev;
        return {
          ...prev,
          series: has
            ? prev.series.filter(s => s !== series)
            : [...prev.series, series]
        };
      }),
    [setState]
  );

  const setColor = useCallback(
    (key: keyof AppState["colors"], value: string) =>
      setState(prev => ({ ...prev, colors: { ...prev.colors, [key]: value } })),
    [setState]
  );

  const setRowMode = useCallback(
    (rowMode: RowMode) => setState(prev => ({ ...prev, rowMode })),
    [setState]
  );

  const setRowCount = useCallback(
    (rowCount: number) => setState(prev => ({ ...prev, rowCount })),
    [setState]
  );

  const toggleChecked = useCallback(
    (gameKey: string, allRowKeys?: string[]) =>
      setState(prev => {
        const wasChecked = prev.checked[gameKey];

        if (!allRowKeys) {
          const checked = wasChecked
            ? Object.fromEntries(
                Object.entries(prev.checked).filter(([k]) => k !== gameKey)
              )
            : { ...prev.checked, [gameKey]: true };
          return { ...prev, checked };
        }

        const idx = allRowKeys.indexOf(gameKey);
        if (idx === -1) return prev;

        const keysToToggle = new Set(
          wasChecked ? allRowKeys.slice(idx) : allRowKeys.slice(0, idx + 1)
        );
        const checked = wasChecked
          ? Object.fromEntries(
              Object.entries(prev.checked).filter(([k]) => !keysToToggle.has(k))
            )
          : {
              ...prev.checked,
              ...Object.fromEntries([...keysToToggle].map(k => [k, true]))
            };

        return { ...prev, checked };
      }),
    [setState]
  );

  const setActiveTab = useCallback(
    (tab: TabKey) => setState(prev => ({ ...prev, activeTab: tab })),
    [setState]
  );

  const setCheckTiming = useCallback(
    (checkTiming: CheckTiming) => setState(prev => ({ ...prev, checkTiming })),
    [setState]
  );

  const setStockinetteEnabled = useCallback(
    (stockinetteEnabled: boolean) =>
      setState(prev => ({ ...prev, stockinetteEnabled })),
    [setState]
  );

  const setStockinetteOddKnit = useCallback(
    (stockinetteOddKnit: boolean) =>
      setState(prev => ({ ...prev, stockinetteOddKnit })),
    [setState]
  );

  const addCustomGame = useCallback(
    (game: Game) =>
      setState(prev => ({
        ...prev,
        customGames: [...(prev.customGames ?? []), game]
      })),
    [setState]
  );

  const removeCustomGame = useCallback(
    (gameKey: string) =>
      setState(prev => ({
        ...prev,
        customGames: (prev.customGames ?? []).filter(g => g.gameKey !== gameKey)
      })),
    [setState]
  );

  const scarfColors: ScarfColors = useMemo(() => {
    const { colors, awaySame } = state;
    const home = {
      win: colors.homeWin,
      draw: colors.homeDraw,
      loss: colors.homeLoss
    };
    return {
      home,
      away: awaySame
        ? home
        : { win: colors.awayWin, draw: colors.awayDraw, loss: colors.awayLoss }
    };
  }, [state]);

  return [
    state,
    {
      setSeason,
      setTeam,
      setAwaySame,
      toggleSeries,
      setColor,
      toggleChecked,
      setRowMode,
      setRowCount,
      setActiveTab,
      setCheckTiming,
      setStockinetteEnabled,
      setStockinetteOddKnit,
      addCustomGame,
      removeCustomGame,
      scarfColors
    }
  ];
}
