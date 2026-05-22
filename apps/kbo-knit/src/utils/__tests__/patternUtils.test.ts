import { describe, expect, it } from "vitest";
import type { KnitPattern } from "../../types/game.types";
import {
  addCustomStitch,
  DEFAULT_KNIT_PATTERN,
  darkenColor,
  getMarkerDarkenAmount,
  getVisualRowIndex,
  getPatternCellsForRow,
  getPatternStitchesForRow,
  normalizeKnitPattern,
  resizeKnitPattern,
  updateKnitPatternCell
} from "../patternUtils";

describe("patternUtils", () => {
  const pattern: KnitPattern = {
    width: 2,
    height: 2,
    cells: [
      ["knit", "purl"],
      ["yarnOver", "purl"]
    ],
    customStitches: []
  };

  it("세로 방향으로 패턴을 반복한다", () => {
    expect(
      getPatternStitchesForRow(pattern, 0).map(stitch => stitch.id)
    ).toEqual(["knit", "purl"]);
    expect(
      getPatternStitchesForRow(pattern, 2).map(stitch => stitch.id)
    ).toEqual(["knit", "purl"]);
    expect(
      getPatternStitchesForRow(pattern, 3).map(stitch => stitch.id)
    ).toEqual(["yarnOver", "purl"]);
  });

  it("가로/세로 변경 시 기존 셀을 보존하고 새 셀은 겉뜨기로 채운다", () => {
    const resized = resizeKnitPattern(pattern, 3, 3);

    expect(resized.width).toBe(3);
    expect(resized.height).toBe(3);
    expect(resized.cells[0]).toEqual(["knit", "purl", "knit"]);
    expect(resized.cells[1]).toEqual(["yarnOver", "purl", "knit"]);
    expect(resized.cells[2]).toEqual(["knit", "knit", "knit"]);
  });

  it("가로폭은 48을 넘어도 제한하지 않는다", () => {
    const resized = resizeKnitPattern(pattern, 72, 2);

    expect(resized.width).toBe(72);
    expect(resized.cells[0]).toHaveLength(72);
  });

  it("알 수 없는 stitch id는 겉뜨기로 fallback한다", () => {
    const unknownPattern: KnitPattern = {
      ...pattern,
      cells: [["missing", "purl"]]
    };

    expect(getPatternStitchesForRow(unknownPattern, 0)[0].id).toBe("knit");
  });

  it("2칸/3칸 기호는 실제 span으로 배치한다", () => {
    const widePattern: KnitPattern = {
      width: 6,
      height: 1,
      cells: [
        ["cableLeft2", "knit", "centerDoubleDecrease", "knit", "purl", "knit"]
      ],
      customStitches: []
    };

    expect(
      getPatternCellsForRow(widePattern, 0).map(cell => ({
        id: cell.stitch.id,
        colIndex: cell.colIndex,
        span: cell.span
      }))
    ).toEqual([
      { id: "cableLeft2", colIndex: 0, span: 2 },
      { id: "centerDoubleDecrease", colIndex: 2, span: 3 },
      { id: "knit", colIndex: 5, span: 1 }
    ]);
  });

  it("큰 기호를 놓을 공간이 부족하면 가로폭을 자동으로 늘린다", () => {
    const smallPattern: KnitPattern = {
      width: 2,
      height: 1,
      cells: [["knit", "knit"]],
      customStitches: []
    };

    const updated = updateKnitPatternCell(
      smallPattern,
      0,
      1,
      "centerDoubleDecrease"
    );

    expect(updated.width).toBe(4);
    expect(updated.cells[0]).toEqual([
      "knit",
      "centerDoubleDecrease",
      "knit",
      "knit"
    ]);
  });

  it("직접 추가한 기호의 코 수를 저장하고 같은 기호라도 코 수별로 구분한다", () => {
    const first = addCustomStitch(pattern, "X", 10, "cable");
    expect(first?.pattern.customStitches[0]).toMatchObject({
      label: "X (10코)",
      symbol: "X",
      icon: "cable",
      span: 10
    });

    const second = addCustomStitch(first!.pattern, "X", 6, "cable");
    expect(second?.pattern.customStitches.map(stitch => stitch.span)).toEqual([
      10, 6
    ]);
  });

  it("아이콘 기호는 이름 없이도 등록한다", () => {
    const result = addCustomStitch(pattern, "", 3, "yarnOver");

    expect(result?.pattern.customStitches[0]).toMatchObject({
      label: "바늘비우기 (3코)",
      symbol: "바늘비우기",
      icon: "yarnOver",
      span: 3
    });
  });

  it("개인 SVG path 아이콘을 저장한다", () => {
    const result = addCustomStitch(
      pattern,
      "leaf",
      2,
      "custom",
      '<svg viewBox="0 0 24 24"><path d="M5 19 C8 5 16 5 19 19" /></svg>'
    );

    expect(result?.pattern.customStitches[0]).toMatchObject({
      label: "leaf (2코)",
      symbol: "leaf",
      icon: "custom",
      customIconPaths: ["M5 19 C8 5 16 5 19 19"],
      span: 2
    });
  });

  it("개인 SVG path가 유효하지 않으면 등록하지 않는다", () => {
    expect(addCustomStitch(pattern, "bad", 1, "custom", "alert(1)")).toBeNull();
  });

  it("기존 localStorage 값에 knitPattern이 없어도 기본값으로 보정한다", () => {
    expect(normalizeKnitPattern(null)).toEqual(DEFAULT_KNIT_PATTERN);
  });

  it("마커 기준과 어둡게 처리 값을 계산한다", () => {
    expect(getMarkerDarkenAmount(1, 23)).toBe(10);
    expect(getMarkerDarkenAmount(5, 23)).toBe(10);
    expect(getMarkerDarkenAmount(10, 23)).toBe(15);
    expect(getMarkerDarkenAmount(23, 23)).toBe(10);
    expect(getMarkerDarkenAmount(3, 23)).toBe(0);
    expect(darkenColor("#ff6600", 15)).toBe("#d95700");
  });

  it("도안 보기 방향에 따른 visual row index를 계산한다", () => {
    expect(getVisualRowIndex(0, 4, "top")).toBe(0);
    expect(getVisualRowIndex(0, 4, "bottom")).toBe(3);
    expect(getVisualRowIndex(3, 4, "bottom")).toBe(0);
  });
});
