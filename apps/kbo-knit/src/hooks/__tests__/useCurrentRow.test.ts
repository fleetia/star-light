import { renderHook } from "@star-light/test-utils";
import { describe, it, expect } from "vitest";
import { useCurrentRow } from "../useCurrentRow";
import type { ScarfRow } from "../../types/game.types";

const makeRow = (key: string): ScarfRow => ({
  gameKey: key,
  rowKey: key,
  color: "#000",
  result: "win",
  isHome: true,
  date: "2026-03-28",
  opponent: "두산",
  score: "5:3",
  prefix: "H"
});

describe("useCurrentRow", () => {
  const rows = [makeRow("r1"), makeRow("r2"), makeRow("r3")];

  it("체크된 것이 없으면 currentRow=0", () => {
    const { result } = renderHook(() => useCurrentRow(rows, {}));
    expect(result.current.currentRow).toBe(0);
    expect(result.current.isAllDone).toBe(false);
  });

  it("연속 체크된 수만큼 currentRow 증가", () => {
    const checked = { r1: true, r2: true };
    const { result } = renderHook(() => useCurrentRow(rows, checked));
    expect(result.current.currentRow).toBe(2);
  });

  it("중간에 빠진 체크는 거기서 멈춤", () => {
    const checked = { r1: true, r3: true };
    const { result } = renderHook(() => useCurrentRow(rows, checked));
    expect(result.current.currentRow).toBe(1);
  });

  it("전부 체크하면 isAllDone=true", () => {
    const checked = { r1: true, r2: true, r3: true };
    const { result } = renderHook(() => useCurrentRow(rows, checked));
    expect(result.current.currentRow).toBe(3);
    expect(result.current.isAllDone).toBe(true);
  });

  it("빈 rows", () => {
    const { result } = renderHook(() => useCurrentRow([], {}));
    expect(result.current.currentRow).toBe(0);
    expect(result.current.isAllDone).toBe(true);
  });
});
