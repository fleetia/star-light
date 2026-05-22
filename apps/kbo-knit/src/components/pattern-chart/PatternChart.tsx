import type {
  KnitPattern,
  PatternViewOrigin,
  ScarfRow
} from "../../types/game.types";
import {
  darkenColor,
  getMarkerDarkenAmount,
  getPatternCellsForRow,
  getReadableTextColor,
  getVisualRowIndex
} from "../../utils/patternUtils";
import { useProgress } from "../../hooks/useProgress";
import { StitchSymbol } from "../stitch-symbol/StitchSymbol";
import * as s from "./PatternChart.css";

type Props = {
  rows: ScarfRow[];
  pattern: KnitPattern;
  cellSize: number;
  viewOrigin: PatternViewOrigin;
  checked: Record<string, boolean>;
  onToggleCheck: (rowKey: string) => void;
};

export function PatternChart({
  rows,
  pattern,
  cellSize,
  viewOrigin,
  checked,
  onToggleCheck
}: Props) {
  const { doneCount, total, percentage } = useProgress(rows, checked);
  const gridTemplateColumns = `2.8rem repeat(${pattern.width}, ${cellSize}px)`;
  const markerColumns = Array.from({ length: pattern.width }, (_, index) => {
    const colNumber = index + 1;
    return {
      colNumber,
      darkenAmount: getMarkerDarkenAmount(colNumber, pattern.width)
    };
  });
  const visualRows = rows.map((_, rowIndex) => {
    const sourceIndex = getVisualRowIndex(rowIndex, rows.length, viewOrigin);
    return { row: rows[sourceIndex], sourceIndex };
  });

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.progress}>
          {doneCount} / {total}단 완료 ({percentage}%)
        </span>
      </div>

      <div className={s.chartWrap}>
        <div className={s.chart}>
          {visualRows.map(({ row, sourceIndex }) => {
            const rowNumber = sourceIndex + 1;
            const cells = getPatternCellsForRow(pattern, sourceIndex);
            const isDone = checked[row.rowKey];
            const rowMarkerDarken = getMarkerDarkenAmount(
              rowNumber,
              rows.length
            );

            return (
              <div
                key={row.rowKey}
                className={`${s.row} ${isDone ? s.done : ""}`}
                style={{ gridTemplateColumns }}
              >
                <button
                  type="button"
                  className={s.rowNumber}
                  aria-label={`${rowNumber}단 완료`}
                  style={{
                    background:
                      rowMarkerDarken > 0
                        ? darkenColor("#ffffff", rowMarkerDarken)
                        : undefined
                  }}
                  onClick={() => onToggleCheck(row.rowKey)}
                >
                  {rowMarkerDarken > 0 ? rowNumber : ""}
                </button>
                {cells.map(({ stitch, colIndex, span }) => {
                  const textColor = getReadableTextColor(row.color);

                  return (
                    <button
                      key={`${row.rowKey}-${colIndex}`}
                      type="button"
                      className={s.cell}
                      style={{
                        background: row.color,
                        color: textColor,
                        gridColumn: `span ${span}`,
                        height: cellSize
                      }}
                      title={stitch.label}
                      aria-label={`${rowNumber}단 ${colIndex + 1}코 ${stitch.label}`}
                      onClick={() => onToggleCheck(row.rowKey)}
                    >
                      <StitchSymbol stitch={stitch} />
                    </button>
                  );
                })}
              </div>
            );
          })}
          <div
            className={s.footerRow}
            style={{ gridTemplateColumns }}
            aria-hidden="true"
          >
            <span className={s.corner} />
            {markerColumns.map(({ colNumber, darkenAmount }) => (
              <span
                key={colNumber}
                className={s.colNumber}
                style={{
                  background:
                    darkenAmount > 0
                      ? darkenColor("#ffffff", darkenAmount)
                      : undefined
                }}
              >
                {darkenAmount > 0 ? colNumber : ""}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
