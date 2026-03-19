import { Select } from "@star-light/components/Select";
import { TextInput } from "@star-light/components/TextInput";
import { Box } from "@star-light/components/Box";

import type { RowMode } from "../../types/game.types";
import * as s from "./RowModeSelector.css";

type Props = {
  mode: RowMode;
  count: number;
  onModeChange: (mode: RowMode) => void;
  onCountChange: (count: number) => void;
};

const MODE_LABELS: Record<RowMode, string> = {
  perGame: "경기당",
  perScore: "득점당",
  perDiff: "점수차이당"
};

export function RowModeSelector({
  mode,
  count,
  onModeChange,
  onCountChange
}: Props) {
  return (
    <Box title="줄 수 설정" className={s.group}>
      <div className={s.row}>
        <Select
          value={mode}
          onChange={(v: string) => onModeChange(v as RowMode)}
        >
          {Object.entries(MODE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </Select>
        <TextInput
          type="number"
          min={1}
          max={10}
          value={String(count)}
          onChange={v => {
            const n = Math.max(1, Math.min(10, Number(v) || 1));
            onCountChange(n);
          }}
          className={s.countInput}
        />
        <span>줄</span>
      </div>
    </Box>
  );
}
