import { renderHook } from "@star-light/test-utils";
import { describe, it, expect } from "vitest";
import { useProgress } from "../useProgress";
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

describe("useProgress", () => {
  const rows = [makeRow("r1"), makeRow("r2"), makeRow("r3"), makeRow("r4")];

  it("기본 반환값 확인", () => {
    const { result } = renderHook(() => useProgress(rows, {}));
    expect(result.current).toEqual({
      doneCount: 0,
      total: 4,
      percentage: 0
    });
  });

  it("체크 수에 따른 진행률", () => {
    const checked = { r1: true, r3: true };
    const { result } = renderHook(() => useProgress(rows, checked));
    expect(result.current.doneCount).toBe(2);
    expect(result.current.percentage).toBe(50);
  });

  it("전부 체크 시 100%", () => {
    const checked = { r1: true, r2: true, r3: true, r4: true };
    const { result } = renderHook(() => useProgress(rows, checked));
    expect(result.current.percentage).toBe(100);
  });

  it("빈 rows 시 0%", () => {
    const { result } = renderHook(() => useProgress([], {}));
    expect(result.current).toEqual({
      doneCount: 0,
      total: 0,
      percentage: 0
    });
  });
});
