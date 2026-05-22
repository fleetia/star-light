import { fireEvent, render, screen } from "@star-light/test-utils";
import { describe, expect, it, vi } from "vitest";
import type { KnitPattern } from "../../../types/game.types";
import { KnitPatternEditor } from "../KnitPatternEditor";

const makePattern = (): KnitPattern => ({
  width: 2,
  height: 2,
  cells: [
    ["knit", "knit"],
    ["knit", "knit"]
  ],
  customStitches: []
});

describe("KnitPatternEditor", () => {
  it("선택한 기호를 셀에 적용한다", () => {
    const onChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={onChange}
        onCellSizeChange={() => {}}
        onViewOriginChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "안뜨기" }));
    fireEvent.click(screen.getByLabelText("1단 1코 겉뜨기"));

    const nextPattern = onChange.mock.calls.at(-1)?.[0] as KnitPattern;
    expect(nextPattern.cells[0][0]).toBe("purl");
  });

  it("가로/세로 입력 변경 시 차트 크기를 변경한다", () => {
    const onChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={onChange}
        onCellSizeChange={() => {}}
        onViewOriginChange={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText("가로 코 수"), {
      target: { value: "4" }
    });
    fireEvent.blur(screen.getByLabelText("가로 코 수"));

    const nextPattern = onChange.mock.calls.at(-1)?.[0] as KnitPattern;
    expect(nextPattern.width).toBe(4);
    expect(nextPattern.height).toBe(2);
    expect(nextPattern.cells[0]).toEqual(["knit", "knit", "knit", "knit"]);
  });

  it("직접 입력한 기호를 추가하고 선택한다", () => {
    const onChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={onChange}
        onCellSizeChange={() => {}}
        onViewOriginChange={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText("기호 이름"), {
      target: { value: "X" }
    });
    fireEvent.change(screen.getByLabelText("기호 코 수"), {
      target: { value: "10" }
    });
    fireEvent.click(screen.getByRole("button", { name: "꽈배기 아이콘" }));
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    const nextPattern = onChange.mock.calls.at(-1)?.[0] as KnitPattern;
    expect(nextPattern.customStitches[0]).toMatchObject({
      label: "X (10코)",
      symbol: "X",
      icon: "cable",
      span: 10
    });
  });

  it("개인 SVG path 아이콘을 추가한다", () => {
    const onChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={onChange}
        onCellSizeChange={() => {}}
        onViewOriginChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "개인 SVG 아이콘" }));
    fireEvent.change(screen.getByLabelText("기호 이름"), {
      target: { value: "leaf" }
    });
    fireEvent.change(screen.getByLabelText("SVG path"), {
      target: { value: "M5 19 C8 5 16 5 19 19" }
    });
    fireEvent.click(screen.getByRole("button", { name: "추가" }));

    const nextPattern = onChange.mock.calls.at(-1)?.[0] as KnitPattern;
    expect(nextPattern.customStitches[0]).toMatchObject({
      label: "leaf",
      symbol: "leaf",
      icon: "custom",
      customIconPaths: ["M5 19 C8 5 16 5 19 19"],
      span: 1
    });
  });

  it("칸 크기 슬라이더 변경을 전달한다", () => {
    const onCellSizeChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={() => {}}
        onCellSizeChange={onCellSizeChange}
        onViewOriginChange={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText("칸 크기"), {
      target: { value: "14" }
    });

    expect(onCellSizeChange).toHaveBeenCalledWith(14);
  });

  it("도안 보기 방향 변경을 전달한다", () => {
    const onViewOriginChange = vi.fn();
    render(
      <KnitPatternEditor
        pattern={makePattern()}
        cellSize={8}
        viewOrigin="bottom"
        onChange={() => {}}
        onCellSizeChange={() => {}}
        onViewOriginChange={onViewOriginChange}
      />
    );

    fireEvent.click(screen.getByLabelText("위에서부터 보기"));

    expect(onViewOriginChange).toHaveBeenCalledWith("top");
  });

  it("편집 도안에도 행/열 기준 숫자를 표시한다", () => {
    render(
      <KnitPatternEditor
        pattern={{
          width: 10,
          height: 10,
          cells: Array.from({ length: 10 }, () =>
            Array.from({ length: 10 }, () => "knit")
          ),
          customStitches: []
        }}
        cellSize={8}
        viewOrigin="bottom"
        onChange={() => {}}
        onCellSizeChange={() => {}}
        onViewOriginChange={() => {}}
      />
    );

    expect(screen.getAllByText("1").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("10").length).toBeGreaterThanOrEqual(2);
  });
});
