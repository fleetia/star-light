import { fireEvent, render, screen } from "@star-light/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { KnitPattern, ScarfRow } from "../../../types/game.types";
import { PatternChart } from "../PatternChart";

const rows: ScarfRow[] = [
  {
    gameKey: "g1",
    rowKey: "g1",
    color: "#ff6600",
    result: "win",
    isHome: true,
    date: "2026-03-28",
    opponent: "두산 베어스",
    score: "5:3",
    prefix: "H"
  },
  {
    gameKey: "g2",
    rowKey: "g2",
    color: "#000000",
    result: "loss",
    isHome: true,
    date: "2026-03-29",
    opponent: "LG 트윈스",
    score: "1:4",
    prefix: "H"
  }
];

const pattern: KnitPattern = {
  width: 2,
  height: 1,
  cells: [["knit", "purl"]],
  customStitches: []
};

describe("PatternChart", () => {
  it("경기 날짜/상대/점수 문구 없이 차트만 표시한다", () => {
    render(
      <PatternChart
        rows={rows}
        pattern={pattern}
        cellSize={8}
        viewOrigin="top"
        checked={{}}
        onToggleCheck={() => {}}
      />
    );

    expect(screen.queryByText(/2026-03-28/)).toBeNull();
    expect(screen.queryByText(/두산 베어스/)).toBeNull();
    expect(screen.queryByText(/5:3/)).toBeNull();
    expect(screen.getAllByLabelText(/겉뜨기/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/안뜨기/)).toHaveLength(2);
  });

  it("셀 클릭 시 해당 단 완료 체크를 호출한다", () => {
    const onToggleCheck = vi.fn();
    render(
      <PatternChart
        rows={rows}
        pattern={pattern}
        cellSize={8}
        viewOrigin="top"
        checked={{}}
        onToggleCheck={onToggleCheck}
      />
    );

    fireEvent.click(screen.getByLabelText("2단 1코 겉뜨기"));

    expect(onToggleCheck).toHaveBeenCalledWith("g2");
  });

  it("2칸짜리 기호를 한 셀로 렌더링한다", () => {
    render(
      <PatternChart
        rows={[rows[0]]}
        pattern={{
          width: 3,
          height: 1,
          cells: [["cableLeft2", "knit", "purl"]],
          customStitches: []
        }}
        cellSize={8}
        viewOrigin="top"
        checked={{}}
        onToggleCheck={() => {}}
      />
    );

    const cable = screen.getByLabelText("1단 1코 2코 왼꽈배기");
    expect(cable.getAttribute("style")).toContain("grid-column: span 2");
    expect(screen.queryByLabelText("1단 2코 겉뜨기")).toBeNull();
  });

  it("아래에서부터 보기에서는 마지막 단이 먼저 렌더링된다", () => {
    render(
      <PatternChart
        rows={rows}
        pattern={pattern}
        cellSize={8}
        viewOrigin="bottom"
        checked={{}}
        onToggleCheck={() => {}}
      />
    );

    const rowButtons = screen.getAllByRole("button", { name: /단 완료/ });
    expect(rowButtons[0].textContent).toBe("2");
    expect(rowButtons[1].textContent).toBe("1");
  });

  it("좌측과 하단 헤더에만 첫칸/마지막칸과 5/10단위 숫자를 표시한다", () => {
    render(
      <PatternChart
        rows={[rows[0]]}
        pattern={{
          width: 10,
          height: 1,
          cells: [
            [
              "knit",
              "knit",
              "knit",
              "knit",
              "knit",
              "knit",
              "knit",
              "knit",
              "knit",
              "knit"
            ]
          ],
          customStitches: []
        }}
        cellSize={8}
        viewOrigin="top"
        checked={{}}
        onToggleCheck={() => {}}
      />
    );

    expect(screen.getAllByText("1")).toHaveLength(2);
    expect(screen.getByText("5")).toBeDefined();
    expect(screen.getByText("10")).toBeDefined();
    expect(
      screen.getByLabelText("1단 10코 겉뜨기").getAttribute("style")
    ).toContain("#ff6600");
  });
});
