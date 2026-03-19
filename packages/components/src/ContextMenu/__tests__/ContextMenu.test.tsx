import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ContextMenu } from "../ContextMenu";
import * as styles from "../ContextMenu.css";

describe("ContextMenu", () => {
  const createItems = () => [
    { label: "Edit", onClick: vi.fn() },
    { label: "Delete", onClick: vi.fn(), variant: "danger" as const }
  ];

  it("renders all menu items", () => {
    render(<ContextMenu x={100} y={200} items={createItems()} />);
    expect(screen.getByText("Edit")).toBeDefined();
    expect(screen.getByText("Delete")).toBeDefined();
  });

  it("positions the menu at the given coordinates", () => {
    const { container } = render(
      <ContextMenu x={100} y={200} items={createItems()} />
    );
    const menu = container.firstElementChild as HTMLElement;
    expect(menu.style.left).toBe("100px");
    expect(menu.style.top).toBe("200px");
  });

  it("calls onClick when item is clicked", () => {
    const items = createItems();
    render(<ContextMenu x={0} y={0} items={items} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(items[0].onClick).toHaveBeenCalledTimes(1);
  });

  it("applies danger class for danger variant", () => {
    render(<ContextMenu x={0} y={0} items={createItems()} />);
    const deleteButton = screen.getByText("Delete");
    expect(deleteButton.className).toContain(styles.deleteVariant);
  });

  it("does not apply danger class for default variant", () => {
    render(<ContextMenu x={0} y={0} items={createItems()} />);
    const editButton = screen.getByText("Edit");
    expect(editButton.className).not.toContain(styles.deleteVariant);
  });

  it("has role=menu on the container", () => {
    render(<ContextMenu x={0} y={0} items={createItems()} />);
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("has role=menuitem on each item", () => {
    render(<ContextMenu x={0} y={0} items={createItems()} />);
    expect(screen.getAllByRole("menuitem")).toHaveLength(2);
  });

  it("calls onClose when item is clicked", () => {
    const onClose = vi.fn();
    const items = createItems();
    render(<ContextMenu x={0} y={0} items={items} onClose={onClose} />);
    fireEvent.click(screen.getByText("Edit"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates with ArrowDown key", () => {
    render(<ContextMenu x={0} y={0} items={createItems()} />);
    const menu = screen.getByRole("menu");
    const menuItems = screen.getAllByRole("menuitem");
    menuItems[0].focus();
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(document.activeElement).toBe(menuItems[1]);
  });

  it("closes on Escape key", () => {
    const onClose = vi.fn();
    render(<ContextMenu x={0} y={0} items={createItems()} onClose={onClose} />);
    fireEvent.keyDown(screen.getByRole("menu"), { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
