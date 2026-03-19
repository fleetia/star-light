import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CardPagination } from "../CardPagination";

describe("CardPagination", () => {
  it("renders the page indicator", () => {
    render(
      <CardPagination
        currentPage={0}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    expect(screen.getByText("1/5")).toBeDefined();
  });

  it("renders prev and next buttons", () => {
    const { container } = render(
      <CardPagination
        currentPage={0}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    const buttons = container.querySelectorAll("button");
    expect(buttons.length).toBe(2);
  });

  it("calls onPrev when prev button is clicked", () => {
    const onPrev = vi.fn();
    const { container } = render(
      <CardPagination
        currentPage={1}
        totalPages={5}
        onPrev={onPrev}
        onNext={vi.fn()}
      />
    );
    fireEvent.click(container.querySelectorAll("button")[0]);
    expect(onPrev).toHaveBeenCalledTimes(1);
  });

  it("calls onNext when next button is clicked", () => {
    const onNext = vi.fn();
    const { container } = render(
      <CardPagination
        currentPage={1}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={onNext}
      />
    );
    fireEvent.click(container.querySelectorAll("button")[1]);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it("displays correct page number (1-indexed)", () => {
    render(
      <CardPagination
        currentPage={3}
        totalPages={10}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    expect(screen.getByText("4/10")).toBeDefined();
  });

  it("renders SVG icons inside buttons", () => {
    const { container } = render(
      <CardPagination
        currentPage={0}
        totalPages={5}
        onPrev={vi.fn()}
        onNext={vi.fn()}
      />
    );
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBe(2);
  });
});
