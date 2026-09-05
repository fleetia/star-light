import { Radio, RadioGroup, Switch, VisuallyHidden } from "@fleetia/lagrange";
import { useCurrentRow } from "../../hooks/useCurrentRow";
import type { CheckTiming, ScarfRow } from "../../types/game.types";
import * as s from "./RowCounter.css";

type Props = {
  rows: ScarfRow[];
  checked: Record<string, boolean>;
  onToggleCheck: (rowKey: string) => void;
  checkTiming: CheckTiming;
  onCheckTimingChange: (timing: CheckTiming) => void;
  stockinetteEnabled: boolean;
  onStockinetteEnabledChange: (enabled: boolean) => void;
  stockinetteOddKnit: boolean;
  onStockinetteOddKnitChange: (oddKnit: boolean) => void;
};

export function RowCounter({
  rows,
  checked,
  onToggleCheck,
  checkTiming,
  onCheckTimingChange,
  stockinetteEnabled,
  onStockinetteEnabledChange,
  stockinetteOddKnit,
  onStockinetteOddKnitChange
}: Props) {
  const { currentRow, isAllDone } = useCurrentRow(rows, checked);

  const displayRow = currentRow + 1;
  const currentRowData = rows[currentRow] ?? rows[rows.length - 1];

  const handlePlus = () => {
    if (currentRow < rows.length) {
      onToggleCheck(rows[currentRow].rowKey);
    }
  };

  const handleMinus = () => {
    if (currentRow > 0) {
      onToggleCheck(rows[currentRow - 1].rowKey);
    }
  };

  const isKnit = stockinetteOddKnit
    ? displayRow % 2 === 1
    : displayRow % 2 === 0;

  return (
    <div className={s.container}>
      <div className={s.toggleSection}>
        <span
          className={`${s.toggleLabel} ${checkTiming === "start" ? s.toggleLabelActive : ""}`}
        >
          단 시작할 때 체크
        </span>
        <Switch
          checked={checkTiming === "end"}
          onChange={event =>
            onCheckTimingChange(event.currentTarget.checked ? "end" : "start")
          }
        >
          <VisuallyHidden>끝날 때 체크</VisuallyHidden>
        </Switch>
        <span
          className={`${s.toggleLabel} ${checkTiming === "end" ? s.toggleLabelActive : ""}`}
        >
          끝날 때 체크
        </span>
      </div>

      {currentRowData && (
        <div className={s.colorDisplay}>
          <span>{currentRowData.date.slice(5).replace("-", "/")}</span>
          <br />
          <span>{currentRowData.score.replace(":", " : ")}</span>
          <span
            className={s.swatch}
            style={{ background: currentRowData.color }}
          />
          <span>
            {" "}
            vs {currentRowData.opponent}{" "}
            {currentRowData.prefix === "H" ? "홈" : "원정"}
          </span>
        </div>
      )}

      <div className={s.counterSection}>
        <div className={s.counterRow}>
          <button
            className={s.counterButton}
            onClick={handleMinus}
            disabled={currentRow === 0}
            aria-label="이전 단"
          >
            −
          </button>
          <div
            className={s.counterValue}
            onClick={handlePlus}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === "Enter" && handlePlus()}
            aria-label="다음 단"
          >
            <span className={s.counterUnit}>현재</span>
            <span className={s.counterNum}>
              {isAllDone ? "끝" : displayRow}
            </span>
            <span className={s.counterUnit}>단</span>
            <span className={s.totalText}>총 {rows.length}단</span>
            {stockinetteEnabled && !isAllDone && (
              <span className={s.stitchType}>
                {isKnit ? "겉뜨기" : "안뜨기"}
              </span>
            )}
          </div>
          <div className={s.counterButtonWrap}>
            <button
              className={s.counterButton}
              onClick={handlePlus}
              disabled={isAllDone}
              aria-label="다음 단"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div className={s.stitchSection}>
        <div className={s.stockinetteRow}>
          <Switch
            checked={stockinetteEnabled}
            onChange={event =>
              onStockinetteEnabledChange(event.currentTarget.checked)
            }
          >
            메리야스뜨기
          </Switch>
        </div>

        {stockinetteEnabled && (
          <>
            <RadioGroup
              name="stockinette"
              orientation="horizontal"
              label={<VisuallyHidden>겉뜨기 단</VisuallyHidden>}
              className={s.radioGroup}
              value={stockinetteOddKnit ? "odd" : "even"}
              onValueChange={v => onStockinetteOddKnitChange(v === "odd")}
            >
              <Radio value="odd">홀수단 겉뜨기</Radio>
              <Radio value="even">짝수단 겉뜨기</Radio>
            </RadioGroup>
          </>
        )}
      </div>
    </div>
  );
}
