import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "../Badge";
import * as styles from "../Badge.css";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeDefined();
  });

  it("applies variant class", () => {
    const { container } = render(<Badge variant="active">Active</Badge>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain(styles.variant.active);
  });

  it("applies default variant when none specified", () => {
    const { container } = render(<Badge>Default</Badge>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain(styles.variant.default);
  });

  it("has role=status for active variant", () => {
    render(<Badge variant="active">Active</Badge>);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("has role=status for inactive variant", () => {
    render(<Badge variant="inactive">Inactive</Badge>);
    expect(screen.getByRole("status")).toBeDefined();
  });

  it("has no role for default variant", () => {
    render(<Badge>Default</Badge>);
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(<Badge className="custom">Test</Badge>);
    const span = container.querySelector("span")!;
    expect(span.className).toContain("custom");
  });
});
