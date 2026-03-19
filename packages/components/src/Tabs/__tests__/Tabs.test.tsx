import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "../Tabs";
import * as styles from "../Tabs.css";

describe("Tabs", () => {
  const items = [
    { key: "tab1", label: "General" },
    { key: "tab2", label: "Advanced" },
    { key: "tab3", label: "About" }
  ];

  it("renders all tab labels", () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    expect(screen.getByText("General")).toBeDefined();
    expect(screen.getByText("Advanced")).toBeDefined();
    expect(screen.getByText("About")).toBeDefined();
  });

  it("has role=tablist on container", () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toBeDefined();
  });

  it("has role=tab on each tab", () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("sets aria-selected=true on active tab", () => {
    render(<Tabs items={items} activeKey="tab2" onChange={() => {}} />);
    const advancedTab = screen.getByText("Advanced");
    expect(advancedTab.getAttribute("aria-selected")).toBe("true");
  });

  it("sets aria-selected=false on inactive tabs", () => {
    render(<Tabs items={items} activeKey="tab2" onChange={() => {}} />);
    const generalTab = screen.getByText("General");
    expect(generalTab.getAttribute("aria-selected")).toBe("false");
  });

  it("sets tabIndex=0 on active tab and -1 on others", () => {
    render(<Tabs items={items} activeKey="tab1" onChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs[0].getAttribute("tabindex")).toBe("0");
    expect(tabs[1].getAttribute("tabindex")).toBe("-1");
    expect(tabs[2].getAttribute("tabindex")).toBe("-1");
  });

  it("calls onChange when a tab is clicked", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} activeKey="tab1" onChange={onChange} />);
    fireEvent.click(screen.getByText("Advanced"));
    expect(onChange).toHaveBeenCalledWith("tab2");
  });

  it("applies variant class", () => {
    render(
      <Tabs
        items={items}
        activeKey="tab1"
        onChange={() => {}}
        variant="secondary"
      />
    );
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toContain(styles.container.secondary);
  });

  it("applies custom className", () => {
    const { container } = render(
      <Tabs
        items={items}
        activeKey="tab1"
        onChange={() => {}}
        className="custom"
      />
    );
    const tablist = container.firstElementChild as HTMLElement;
    expect(tablist.className).toContain("custom");
  });
});
