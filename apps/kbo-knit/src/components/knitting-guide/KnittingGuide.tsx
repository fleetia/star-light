import type { ScarfRow } from "../../types/game.types";
import * as s from "./KnittingGuide.css";

type Props = {
  rows: ScarfRow[];
  checked: Record<string, boolean>;
  onToggleCheck: (gameKey: string) => void;
};

export function KnittingGuide({ rows, checked, onToggleCheck }: Props) {
  const doneCount = rows.filter(r => checked[r.rowKey]).length;
  const total = rows.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <span className={s.progress}>
          {doneCount} / {total}단 완료 ({pct}%)
        </span>
      </div>

      <div className={s.list}>
        {rows.map((r, i) => {
          const isChecked = checked[r.rowKey];
          const loc = r.prefix === "H" ? "홈" : "원정";

          return (
            <label
              key={r.rowKey}
              className={`${s.row} ${isChecked ? s.checked : ""}`}
            >
              <input
                type="checkbox"
                className={s.checkbox}
                checked={isChecked}
                onChange={() => onToggleCheck(r.rowKey)}
              />
              <span className={s.rowNum}>{i + 1}</span>
              <span className={s.swatch} style={{ background: r.color }} />
              <span>
                {r.date} {loc} vs {r.opponent} {r.score}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
