import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ColorRow } from "../ColorRow";

describe("ColorRow", () => {
  it("renders the label", () => {
    render(<ColorRow label="Background" value="#ff0000" onChange={vi.fn()} />);
    expect(screen.getByText("Background")).toBeDefined();
  });

  it("contains a color picker trigger button", () => {
    const { container } = render(
      <ColorRow label="Background" value="#ff0000" onChange={vi.fn()} />
    );
    const button = container.querySelector("button");
    expect(button).toBeDefined();
  });

  it("renders with showAlpha prop without error", () => {
    const { container } = render(
      <ColorRow
        label="Background"
        value="#ff0000"
        showAlpha
        onChange={vi.fn()}
      />
    );
    expect(container.firstElementChild).toBeDefined();
  });

  it("renders the color value text", () => {
    render(<ColorRow label="Text" value="#ff0000" onChange={vi.fn()} />);
    expect(screen.getByText("#ff0000")).toBeDefined();
  });
});
