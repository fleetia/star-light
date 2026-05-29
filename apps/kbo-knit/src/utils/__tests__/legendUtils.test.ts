import { describe, it, expect } from "vitest";
import type { ScarfColors } from "../../types/game.types";
import { buildLegend } from "../legendUtils";

const colors: ScarfColors = {
  home: { win: "#ff0000", draw: "#888888", loss: "#000000", cancel: "#777777" },
  away: { win: "#0000ff", draw: "#cccccc", loss: "#333333", cancel: "#aaaaaa" }
};

describe("buildLegend", () => {
  it("awaySame=true → 3개 항목, 접두어 없음", () => {
    const items = buildLegend(colors, true);
    expect(items).toHaveLength(3);
    expect(items.map(i => i.label)).toEqual(["승", "무", "패"]);
    expect(items[0].color).toBe("#ff0000");
  });

  it("awaySame=false → 6개 항목, 홈/원정 접두어", () => {
    const items = buildLegend(colors, false);
    expect(items).toHaveLength(6);
    expect(items.map(i => i.label)).toEqual([
      "홈 승",
      "홈 무",
      "홈 패",
      "원정 승",
      "원정 무",
      "원정 패"
    ]);
    expect(items[3].color).toBe("#0000ff");
  });
});
