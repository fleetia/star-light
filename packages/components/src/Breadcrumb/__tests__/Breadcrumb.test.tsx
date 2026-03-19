import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Breadcrumb } from "../Breadcrumb";
import * as styles from "../Breadcrumb.css";

describe("Breadcrumb", () => {
  const items = [
    { label: "Home", onClick: vi.fn() },
    { label: "Settings", onClick: vi.fn() },
    { label: "Theme" }
  ];

  it("renders all items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home")).toBeDefined();
    expect(screen.getByText("Settings")).toBeDefined();
    expect(screen.getByText("Theme")).toBeDefined();
  });

  it("renders separators between items", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const separators = container.querySelectorAll("span");
    expect(separators.length).toBe(2);
  });

  it("calls onClick when an item is clicked", () => {
    render(<Breadcrumb items={items} />);
    fireEvent.click(screen.getByText("Home"));
    expect(items[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("marks the last item as active", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const buttons = container.querySelectorAll("button");
    const lastButton = buttons[buttons.length - 1];
    expect(lastButton.className).toContain(styles.breadcrumbItemActive);
  });

  it("does not mark non-last items as active", () => {
    const { container } = render(<Breadcrumb items={items} />);
    const buttons = container.querySelectorAll("button");
    expect(buttons[0].className).not.toContain(styles.breadcrumbItemActive);
    expect(buttons[1].className).not.toContain(styles.breadcrumbItemActive);
  });

  it("sets aria-current=page on the last item", () => {
    render(<Breadcrumb items={items} />);
    const theme = screen.getByText("Theme");
    expect(theme.getAttribute("aria-current")).toBe("page");
  });

  it("does not set aria-current on non-last items", () => {
    render(<Breadcrumb items={items} />);
    expect(screen.getByText("Home").getAttribute("aria-current")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Breadcrumb items={items} className="custom" />
    );
    expect(container.firstElementChild!.className).toContain("custom");
  });

  it("renders single item without separator", () => {
    const { container } = render(<Breadcrumb items={[{ label: "Only" }]} />);
    const separators = container.querySelectorAll("span");
    expect(separators.length).toBe(0);
  });
});
