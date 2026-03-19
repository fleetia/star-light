import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Toggle } from "../Toggle";

describe("Toggle", () => {
  it("renders a switch", () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch")).toBeDefined();
  });

  it("has aria-checked matching checked prop", () => {
    render(<Toggle checked={true} onChange={() => {}} />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "true"
    );
  });

  it("has aria-checked=false when unchecked", () => {
    render(<Toggle checked={false} onChange={() => {}} />);
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "false"
    );
  });

  it("calls onChange with toggled value when clicked", () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("calls onChange with false when checked and clicked", () => {
    const onChange = vi.fn();
    render(<Toggle checked={true} onChange={onChange} />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("has disabled attribute when disabled", () => {
    render(<Toggle checked={false} onChange={() => {}} disabled />);
    const button = screen.getByRole("switch") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("does not call onChange when disabled", () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} disabled />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("renders label text", () => {
    render(<Toggle checked={false} onChange={() => {}} label="Dark mode" />);
    expect(screen.getByText("Dark mode")).toBeDefined();
  });

  it("has aria-label matching label prop", () => {
    render(<Toggle checked={false} onChange={() => {}} label="Dark mode" />);
    expect(screen.getByRole("switch").getAttribute("aria-label")).toBe(
      "Dark mode"
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <Toggle checked={false} onChange={() => {}} className="custom" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("custom");
  });
});
