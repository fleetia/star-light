import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Checkbox } from "../Checkbox";

describe("Checkbox", () => {
  it("renders the label", () => {
    render(
      <Checkbox label="Accept terms" checked={false} onChange={() => {}} />
    );
    expect(screen.getByText("Accept terms")).toBeDefined();
  });

  it("renders a checkbox input", () => {
    render(<Checkbox label="Test" checked={false} onChange={() => {}} />);
    expect(screen.getByRole("checkbox")).toBeDefined();
  });

  it("reflects checked state", () => {
    render(<Checkbox label="Test" checked={true} onChange={() => {}} />);
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.checked).toBe(true);
  });

  it("has aria-checked matching checked prop", () => {
    render(<Checkbox label="Test" checked={true} onChange={() => {}} />);
    expect(screen.getByRole("checkbox").getAttribute("aria-checked")).toBe(
      "true"
    );
  });

  it("calls onChange when clicked", () => {
    const onChange = vi.fn();
    render(<Checkbox label="Test" checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("has disabled attribute when disabled", () => {
    render(
      <Checkbox label="Test" checked={false} onChange={() => {}} disabled />
    );
    const input = screen.getByRole("checkbox") as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  it("has label linked to input via htmlFor", () => {
    render(<Checkbox label="Test" checked={false} onChange={() => {}} />);
    const input = screen.getByRole("checkbox");
    const label = input.closest("label");
    expect(label).toBeDefined();
    expect(label!.getAttribute("for")).toBe(input.id);
  });

  it("applies custom className", () => {
    const { container } = render(
      <Checkbox
        label="Test"
        checked={false}
        onChange={() => {}}
        className="custom"
      />
    );
    const label = container.querySelector("label")!;
    expect(label.className).toContain("custom");
  });
});
