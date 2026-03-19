import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PositionGrid } from "../PositionGrid";
import * as styles from "../PositionGrid.css";

describe("PositionGrid", () => {
  const options = [
    "top-left",
    "top-center",
    "top-right",
    "bottom-left",
    "bottom-center",
    "bottom-right"
  ];

  it("renders buttons for all options", () => {
    const { container } = render(
      <PositionGrid value="top-left" options={options} onChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(options.length);
  });

  it("marks the active option", () => {
    const { container } = render(
      <PositionGrid value="top-center" options={options} onChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll("button");
    const activeButton = buttons[1];
    expect(activeButton.className).toContain(styles.positionActive);
  });

  it("does not mark inactive options as active", () => {
    const { container } = render(
      <PositionGrid value="top-left" options={options} onChange={vi.fn()} />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons[1].className).not.toContain(styles.positionActive);
    expect(buttons[2].className).not.toContain(styles.positionActive);
  });

  it("calls onChange with the clicked position", () => {
    const onChange = vi.fn();
    const { container } = render(
      <PositionGrid value="top-left" options={options} onChange={onChange} />
    );
    const buttons = container.querySelectorAll("button");
    fireEvent.click(buttons[3]);
    expect(onChange).toHaveBeenCalledWith("bottom-left");
  });

  it("calls onChange only once per click", () => {
    const onChange = vi.fn();
    const { container } = render(
      <PositionGrid value="top-left" options={options} onChange={onChange} />
    );
    fireEvent.click(container.querySelectorAll("button")[0]);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("renders margin inputs when margin and onMarginChange are provided", () => {
    const margin = { top: 10, bottom: 20, left: 5, right: 15 };
    render(
      <PositionGrid
        value="top-left"
        options={options}
        onChange={vi.fn()}
        margin={margin}
        onMarginChange={vi.fn()}
      />
    );
    expect(screen.getByLabelText("위쪽 여백")).toBeDefined();
    expect(screen.getByLabelText("아래쪽 여백")).toBeDefined();
    expect(screen.getByLabelText("왼쪽 여백")).toBeDefined();
    expect(screen.getByLabelText("오른쪽 여백")).toBeDefined();
  });

  it("calls onMarginChange when margin input changes", () => {
    const margin = { top: 10, bottom: 20, left: 5, right: 15 };
    const onMarginChange = vi.fn();
    render(
      <PositionGrid
        value="top-left"
        options={options}
        onChange={vi.fn()}
        margin={margin}
        onMarginChange={onMarginChange}
      />
    );
    fireEvent.change(screen.getByLabelText("위쪽 여백"), {
      target: { value: "30" }
    });
    expect(onMarginChange).toHaveBeenCalledWith({
      top: 30,
      bottom: 20,
      left: 5,
      right: 15
    });
  });
});
