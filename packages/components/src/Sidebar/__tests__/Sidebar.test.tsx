import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Sidebar } from "../Sidebar";
import * as styles from "../Sidebar.css";

describe("Sidebar", () => {
  it("renders children", () => {
    render(
      <Sidebar>
        <p>Sidebar content</p>
      </Sidebar>
    );
    expect(screen.getByText("Sidebar content")).toBeDefined();
  });

  it("renders as a section element", () => {
    const { container } = render(
      <Sidebar>
        <p>Content</p>
      </Sidebar>
    );
    expect(container.querySelector("section")).toBeDefined();
  });

  it("applies right position class by default", () => {
    const { container } = render(
      <Sidebar>
        <p>Content</p>
      </Sidebar>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain(styles.sidebarRight);
  });

  it("applies left position class when position is left", () => {
    const { container } = render(
      <Sidebar position="left">
        <p>Content</p>
      </Sidebar>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain(styles.sidebarLeft);
  });

  it("applies custom className", () => {
    const { container } = render(
      <Sidebar className="my-sidebar">
        <p>Content</p>
      </Sidebar>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain("my-sidebar");
  });

  it("forwards ref to section element", () => {
    const ref = { current: null as HTMLElement | null };
    render(
      <Sidebar ref={ref}>
        <p>Content</p>
      </Sidebar>
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current!.tagName).toBe("SECTION");
  });

  it("applies base sidebar class", () => {
    const { container } = render(
      <Sidebar>
        <p>Content</p>
      </Sidebar>
    );
    const section = container.querySelector("section")!;
    expect(section.className).toContain(styles.sidebar);
  });
});
