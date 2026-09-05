import { useMemo } from "react";
import type { ScarfRow } from "../types/game.types";

export function useCurrentRow(
  rows: ScarfRow[],
  checked: Record<string, boolean>
) {
  const currentRow = useMemo(() => {
    const idx = rows.findIndex(r => !checked[r.rowKey]);
    return idx === -1 ? rows.length : idx;
  }, [rows, checked]);

  return { currentRow, isAllDone: currentRow >= rows.length };
}
