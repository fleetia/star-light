import { render, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { NavigationButton } from "../NavigationButton";

describe("NavigationButton", () => {
  it("renders a button element", () => {
    const { container } = render(
      <NavigationButton direction="left" onClick={vi.fn()} />
    );
    expect(container.querySelector("button")).toBeDefined();
  });

  it("renders an SVG icon for left direction", () => {
    const { container } = render(
      <NavigationButton direction="left" onClick={vi.fn()} />
    );
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("renders an SVG icon for right direction", () => {
    const { container } = render(
      <NavigationButton direction="right" onClick={vi.fn()} />
    );
    expect(container.querySelector("svg")).toBeDefined();
  });

  it("renders different icons for left and right directions", () => {
    const { container: leftContainer } = render(
      <NavigationButton direction="left" onClick={vi.fn()} />
    );
    const { container: rightContainer } = render(
      <NavigationButton direction="right" onClick={vi.fn()} />
    );
    const leftPath = leftContainer.querySelector("path")!.getAttribute("d");
    const rightPath = rightContainer.querySelector("path")!.getAttribute("d");
    expect(leftPath).not.toBe(rightPath);
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    const { container } = render(
      <NavigationButton direction="left" onClick={handleClick} />
    );
    fireEvent.click(container.querySelector("button")!);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <NavigationButton direction="left" onClick={vi.fn()} className="custom" />
    );
    expect(container.querySelector("button")!.className).toContain("custom");
  });
});
