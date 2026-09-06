import { useCallback, useMemo } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@fleetia/lagrange";
import { CloudAccount } from "./components/cloud-account/CloudAccount";
import { useAppState } from "./hooks/useAppState";
import { useKboData } from "./hooks/useKboData";
import { useCustomGameSync } from "./hooks/useCustomGameSync";
import { useScarfData } from "./hooks/useScarfData";
import { hasStoredValue } from "./hooks/useLocalStorage";
import type { TabKey } from "./types/game.types";
import { STORAGE_KEY } from "./constants/defaults";
import { OWNER_KEY } from "./cloud/storage";
import { SeasonSelector } from "./components/season-selector/SeasonSelector";
import { TeamSelector } from "./components/team-selector/TeamSelector";
import { SeriesFilter } from "./components/series-filter/SeriesFilter";
import { ColorPicker } from "./components/color-picker/ColorPicker";
import { RowModeSelector } from "./components/row-mode-selector/RowModeSelector";
import { ScarfPreview } from "./components/scarf-preview/ScarfPreview";
import { ScarfHorizontal } from "./components/scarf-horizontal/ScarfHorizontal";
import { KnittingGuide } from "./components/knitting-guide/KnittingGuide";
import { RowCounter } from "./components/row-counter/RowCounter";
import { GameEditor } from "./components/game-editor/GameEditor";
import * as s from "./App.css";

const isFirstVisit = !hasStoredValue(STORAGE_KEY) && !hasStoredValue(OWNER_KEY);
const DEFAULT_TAB: TabKey = isFirstVisit ? "options" : "pattern";
const TAB_LABELS: Record<TabKey, string> = {
  pattern: "목도리 패턴",
  guide: "뜨개 가이드",
  counter: "단수 카운터",
  options: "옵션"
};

export function App() {
  const [state, actions, cloud, cloudStore] = useAppState();
  const activeTab = state.activeTab ?? DEFAULT_TAB;
  const { games, isLoading, error } = useKboData(state.season);

  const allGames = useCustomGameSync(
    games,
    state.customGames ?? [],
    state.season,
    actions.removeCustomGame
  );

  const { scarfRows, rowKeys, wins, draws, losses, cancels } = useScarfData(
    allGames,
    state.team,
    state.series,
    actions.scarfColors,
    state.rowMode,
    state.rowCount,
    state.cancelRowCount
  );

  const showCancelLegend = state.cancelRowCount > 0 && cancels > 0;

  const handleToggleCheck = useCallback(
    (key: string) => actions.toggleChecked(key, rowKeys),
    [actions, rowKeys]
  );

  const optionsContent = useMemo(
    () => (
      <div className={s.optionsTab}>
        <CloudAccount snapshot={cloud} store={cloudStore} />
        <div className={s.settings}>
          <SeasonSelector value={state.season} onChange={actions.setSeason} />
          <TeamSelector value={state.team} onChange={actions.setTeam} />
          <SeriesFilter active={state.series} onToggle={actions.toggleSeries} />
        </div>
        <ColorPicker
          colors={state.colors}
          awaySame={state.awaySame}
          onAwaySameChange={actions.setAwaySame}
          onColorChange={actions.setColor}
        />
        <RowModeSelector
          mode={state.rowMode}
          count={state.rowCount}
          cancelCount={state.cancelRowCount}
          onModeChange={actions.setRowMode}
          onCountChange={actions.setRowCount}
          onCancelCountChange={actions.setCancelRowCount}
        />
      </div>
    ),
    [state, actions, cloud, cloudStore]
  );

  const hasRows = !isLoading && !error && scarfRows.length > 0;
  const emptyMessage =
    !isLoading && !error && scarfRows.length === 0
      ? "진행된 경기가 없습니다."
      : null;

  return (
    <div className={s.app}>
      <h1 className={s.title}>크보니트</h1>
      <p className={s.subtitle}>
        경기 결과를 목도리 배색 패턴으로 만들어보세요
      </p>

      {isLoading && <p className={s.loading}>데이터 로딩 중...</p>}
      {error && <p className={s.error}>{error}</p>}

      {hasRows && (
        <>
          <ScarfHorizontal
            rows={scarfRows}
            colors={actions.scarfColors}
            awaySame={state.awaySame}
            series={state.series}
            showCancelLegend={showCancelLegend}
          />

          <GameEditor
            team={state.team}
            season={state.season}
            series={state.series}
            games={games}
            customGames={state.customGames ?? []}
            onAdd={actions.addCustomGame}
            onRemove={actions.removeCustomGame}
          />
        </>
      )}

      {!isLoading && (
        <Tabs
          value={activeTab}
          onValueChange={key => actions.setActiveTab(key as TabKey)}
        >
          <TabList aria-label="뜨개 작업" className={s.tabList}>
            {Object.entries(TAB_LABELS).map(([key, label]) => (
              <Tab key={key} value={key} className={s.tab}>
                {label}
              </Tab>
            ))}
          </TabList>
          <TabPanel value="pattern" className={s.tabPanel}>
            {activeTab === "pattern" &&
              (hasRows ? (
                <ScarfPreview
                  rows={scarfRows}
                  colors={actions.scarfColors}
                  awaySame={state.awaySame}
                  wins={wins}
                  draws={draws}
                  losses={losses}
                  cancels={cancels}
                  showCancelLegend={showCancelLegend}
                  checked={state.checked}
                  onToggleCheck={handleToggleCheck}
                />
              ) : (
                <p className={s.empty}>{emptyMessage}</p>
              ))}
          </TabPanel>
          <TabPanel value="guide" className={s.tabPanel}>
            {activeTab === "guide" &&
              (hasRows ? (
                <KnittingGuide
                  rows={scarfRows}
                  checked={state.checked}
                  onToggleCheck={handleToggleCheck}
                />
              ) : (
                <p className={s.empty}>{emptyMessage}</p>
              ))}
          </TabPanel>
          <TabPanel value="counter" className={s.tabPanel}>
            {activeTab === "counter" &&
              (hasRows ? (
                <RowCounter
                  rows={scarfRows}
                  checked={state.checked}
                  onToggleCheck={handleToggleCheck}
                  checkTiming={state.checkTiming ?? "start"}
                  onCheckTimingChange={actions.setCheckTiming}
                  stockinetteEnabled={state.stockinetteEnabled ?? false}
                  onStockinetteEnabledChange={actions.setStockinetteEnabled}
                  stockinetteOddKnit={state.stockinetteOddKnit ?? true}
                  onStockinetteOddKnitChange={actions.setStockinetteOddKnit}
                />
              ) : (
                <p className={s.empty}>{emptyMessage}</p>
              ))}
          </TabPanel>
          <TabPanel value="options" className={s.tabPanel}>
            {activeTab === "options" && optionsContent}
          </TabPanel>
        </Tabs>
      )}

      <footer className={s.footer}>
        <div className={s.footerCredits}>
          inspired by{" "}
          <a
            className={s.footerLink}
            href="https://x.com/hook_h_"
            target="_blank"
            rel="noopener noreferrer"
          >
            뜨개일기님
          </a>
          의{" "}
          <a
            className={s.footerLink}
            href="https://x.com/hook_h_/status/2022222157271662923"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "underline" }}
          >
            트윗
          </a>
          <br />
          dev by{" "}
          <a className={s.footerLink} target="_blank" rel="noopener noreferrer">
            lammer
          </a>
        </div>
      </footer>
    </div>
  );
}
