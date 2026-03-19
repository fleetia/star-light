import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RangeInput } from "../RangeInput";

describe("RangeInput", () => {
  it("renders the label and value", () => {
    render(
      <RangeInput
        label="Opacity"
        value={50}
        min={0}
        max={100}
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Opacity: 50")).toBeDefined();
  });

  it("renders displayValue when provided", () => {
    render(
      <RangeInput
        label="Size"
        value={10}
        min={0}
        max={100}
        displayValue="10px"
        onChange={vi.fn()}
      />
    );
    expect(screen.getByText("Size: 10px")).toBeDefined();
  });

  it("renders a range input element", () => {
    const { container } = render(
      <RangeInput
        label="Opacity"
        value={50}
        min={0}
        max={100}
        onChange={vi.fn()}
      />
    );
    const input = container.querySelector("input[type='range']");
    expect(input).toBeDefined();
  });

  it("sets min, max, step, and value attributes", () => {
    const { container } = render(
      <RangeInput
        label="Opacity"
        value={50}
        min={0}
        max={100}
        step={5}
        onChange={vi.fn()}
      />
    );
    const input = container.querySelector(
      "input[type='range']"
    ) as HTMLInputElement;
    expect(input.min).toBe("0");
    expect(input.max).toBe("100");
    expect(input.step).toBe("5");
    expect(input.value).toBe("50");
  });

  it("calls onChange with parsed float value", () => {
    const onChange = vi.fn();
    const { container } = render(
      <RangeInput
        label="Opacity"
        value={50}
        min={0}
        max={100}
        onChange={onChange}
      />
    );
    const input = container.querySelector("input[type='range']")!;
    fireEvent.change(input, { target: { value: "75" } });
    expect(onChange).toHaveBeenCalledWith(75);
  });
});
