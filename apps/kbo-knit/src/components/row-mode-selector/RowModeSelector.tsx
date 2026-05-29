import { useState } from "react";
import { Select } from "@star-light/components/Select";
import { TextInput } from "@star-light/components/TextInput";
import { Box } from "@star-light/components/Box";

import type { RowMode } from "../../types/game.types";
import * as s from "./RowModeSelector.css";

type Props = {
  mode: RowMode;
  count: number;
  cancelCount: number;
  onModeChange: (mode: RowMode) => void;
  onCountChange: (count: number) => void;
  onCancelCountChange: (count: number) => void;
};

const MODE_LABELS: Record<RowMode, string> = {
  perGame: "경기당",
  perScore: "득점당",
  perOpScore: "득점/실점당",
  perDiff: "점수차이당"
};

function clampCount(v: string): number {
  const n = parseInt(v, 10);
  if (isNaN(n) || n < 1) return 1;
  return Math.min(10, n);
}

function clampCancelCount(v: string): number {
  const n = parseInt(v, 10);
  if (isNaN(n) || n < 0) return 0;
  return Math.min(10, n);
}

export function RowModeSelector({
  mode,
  count,
  cancelCount,
  onModeChange,
  onCountChange,
  onCancelCountChange
}: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const [cancelDraft, setCancelDraft] = useState<string | null>(null);

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
          value={draft ?? String(count)}
          onChange={v => setDraft(v)}
          onBlur={() => {
            const clamped = clampCount(draft ?? String(count));
            onCountChange(clamped);
            setDraft(null);
          }}
          className={s.countInput}
        />
        <span>줄</span>
      </div>
      <div className={s.row}>
        <span>취소 경기</span>
        <TextInput
          type="number"
          min={0}
          max={10}
          value={cancelDraft ?? String(cancelCount)}
          onChange={v => setCancelDraft(v)}
          onBlur={() => {
            const clamped = clampCancelCount(
              cancelDraft ?? String(cancelCount)
            );
            onCancelCountChange(clamped);
            setCancelDraft(null);
          }}
          className={s.countInput}
        />
        <span>줄 (0=숨김)</span>
      </div>
    </Box>
  );
}
