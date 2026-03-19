import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CollapsibleSection } from "../CollapsibleSection";

describe("CollapsibleSection", () => {
  it("renders the title", () => {
    render(
      <CollapsibleSection title="Advanced">
        <p>Content</p>
      </CollapsibleSection>
    );
    expect(screen.getByText("Advanced")).toBeDefined();
  });

  it("renders children", () => {
    render(
      <CollapsibleSection title="Section" defaultOpen>
        <p>Inner content</p>
      </CollapsibleSection>
    );
    expect(screen.getByText("Inner content")).toBeDefined();
  });

  it("starts closed by default (aria-expanded=false)", () => {
    render(
      <CollapsibleSection title="Section">
        <p>Content</p>
      </CollapsibleSection>
    );
    const button = screen.getByText("Section");
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("starts open when defaultOpen is true", () => {
    render(
      <CollapsibleSection title="Section" defaultOpen>
        <p>Content</p>
      </CollapsibleSection>
    );
    const button = screen.getByText("Section");
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("toggles aria-expanded on click", () => {
    render(
      <CollapsibleSection title="Section">
        <p>Content</p>
      </CollapsibleSection>
    );
    const button = screen.getByText("Section");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });
});
