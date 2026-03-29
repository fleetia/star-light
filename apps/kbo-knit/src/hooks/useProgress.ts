import { useMemo } from "react";
import type { ScarfRow } from "../types/game.types";

export function useProgress(
  rows: ScarfRow[],
  checked: Record<string, boolean>
) {
  return useMemo(() => {
    const doneCount = rows.filter(r => checked[r.rowKey]).length;
    const total = rows.length;
    const percentage = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    return { doneCount, total, percentage };
  }, [rows, checked]);
}
