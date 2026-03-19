import { useState, useCallback } from "react";
import type { ScarfRow, ScarfColors } from "../../types/game.types";
import { RESULT_LABELS } from "../../constants/teams";
import { buildLegend } from "../../utils/legendUtils";
import { Legend } from "../legend/Legend";
import * as s from "./ScarfPreview.css";

type Props = {
  rows: ScarfRow[];
  colors: ScarfColors;
  awaySame: boolean;
  wins: number;
  draws: number;
  losses: number;
  checked: Record<string, boolean>;
  onToggleCheck: (gameKey: string) => void;
};

export function ScarfPreview({
  rows,
  colors,
  awaySame,
  wins,
  draws,
  losses,
  checked,
  onToggleCheck
}: Props) {
  const legend = buildLegend(colors, awaySame);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const handleRowClick = useCallback(
    (gameKey: string) => {
      const isMobile = window.matchMedia("(hover: none)").matches;
      if (isMobile) {
        if (expandedKey === gameKey) {
          onToggleCheck(gameKey);
          setExpandedKey(null);
        } else {
          setExpandedKey(gameKey);
        }
      } else {
        onToggleCheck(gameKey);
      }
    },
    [expandedKey, onToggleCheck]
  );

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.stats}>
          {wins + draws + losses}경기 | {wins}승 {draws}무 {losses}패
        </span>
      </div>

      <div className={s.scarf}>
        {rows.map(r => {
          const isDone = checked[r.rowKey];
          const isExpanded = expandedKey === r.rowKey;
          return (
            <div
              key={r.rowKey}
              role="button"
              tabIndex={0}
              className={`${s.row} ${isDone ? s.done : ""} ${isExpanded ? s.expanded : ""}`}
              onClick={() => handleRowClick(r.rowKey)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleRowClick(r.rowKey);
                }
              }}
            >
              <div className={s.bar} style={{ background: r.color }}>
                <span className={s.tooltip}>
                  {r.date} {r.prefix} vs {r.opponent} {r.score}{" "}
                  {RESULT_LABELS[r.result]}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Legend items={legend} />
    </div>
  );
}
