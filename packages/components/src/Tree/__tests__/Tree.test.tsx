import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tree, type TreeItem } from "../Tree";

describe("Tree", () => {
  const simpleItems: TreeItem[] = [
    { id: "1", label: "Item 1" },
    { id: "2", label: "Item 2" }
  ];

  const nestedItems: TreeItem[] = [
    {
      id: "folder1",
      label: "Folder",
      expanded: true,
      children: [
        { id: "child1", label: "Child 1" },
        { id: "child2", label: "Child 2" }
      ]
    },
    { id: "item1", label: "Item 1" }
  ];

  it("has role=tree on container", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} />);
    expect(screen.getByRole("tree")).toBeDefined();
  });

  it("renders all items with role=treeitem", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} />);
    expect(screen.getAllByRole("treeitem")).toHaveLength(2);
  });

  it("renders item labels", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} />);
    expect(screen.getByText("Item 1")).toBeDefined();
    expect(screen.getByText("Item 2")).toBeDefined();
  });

  it("renders nested children when expanded", () => {
    render(<Tree items={nestedItems} onToggle={() => {}} />);
    expect(screen.getByText("Child 1")).toBeDefined();
    expect(screen.getByText("Child 2")).toBeDefined();
  });

  it("has aria-expanded=true on expanded parent", () => {
    render(<Tree items={nestedItems} onToggle={() => {}} />);
    const folder = screen.getByLabelText("Folder");
    expect(folder.getAttribute("aria-expanded")).toBe("true");
  });

  it("has aria-expanded=false on collapsed parent", () => {
    const collapsedItems: TreeItem[] = [
      {
        id: "folder1",
        label: "Folder",
        expanded: false,
        children: [{ id: "child1", label: "Child 1" }]
      }
    ];
    render(<Tree items={collapsedItems} onToggle={() => {}} />);
    const folder = screen.getByLabelText("Folder");
    expect(folder.getAttribute("aria-expanded")).toBe("false");
  });

  it("does not have aria-expanded on leaf items", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} />);
    const item = screen.getByLabelText("Item 1");
    expect(item.getAttribute("aria-expanded")).toBeNull();
  });

  it("sets tabIndex=0 on first item only", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} />);
    const items = screen.getAllByRole("treeitem");
    expect(items[0].getAttribute("tabindex")).toBe("0");
    expect(items[1].getAttribute("tabindex")).toBe("-1");
  });

  it("does not render hidden children when collapsed", () => {
    const collapsedItems: TreeItem[] = [
      {
        id: "folder1",
        label: "Folder",
        expanded: false,
        children: [{ id: "child1", label: "Hidden Child" }]
      }
    ];
    render(<Tree items={collapsedItems} onToggle={() => {}} />);
    expect(screen.queryByText("Hidden Child")).toBeNull();
  });

  it("renders visibility toggle when onVisibilityToggle is provided", () => {
    const onVisibilityToggle = vi.fn();
    render(
      <Tree
        items={simpleItems}
        onToggle={() => {}}
        onVisibilityToggle={onVisibilityToggle}
      />
    );
    const buttons = screen.getAllByTitle("숨기기");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    render(<Tree items={simpleItems} onToggle={() => {}} className="custom" />);
    const tree = screen.getByRole("tree");
    expect(tree.className).toContain("custom");
  });
});
