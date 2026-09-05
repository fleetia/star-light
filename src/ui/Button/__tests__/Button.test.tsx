import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../Button";
import * as styles from "../Button.css";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeDefined();
  });

  it("renders as a button element", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button")).toBeDefined();
  });

  it("has type=button by default", () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("supports type=submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("applies variant class", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(styles.variant.primary);
  });

  it("applies size class", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(styles.size.sm);
  });

  it("applies disabled attribute", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button") as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("has aria-disabled when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe(
      "true"
    );
  });

  it("supports aria-busy", () => {
    render(<Button aria-busy={true}>Loading</Button>);
    expect(screen.getByRole("button").getAttribute("aria-busy")).toBe("true");
  });

  it("applies custom className", () => {
    render(<Button className="custom">Click</Button>);
    expect(screen.getByRole("button").className).toContain("custom");
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("defaults to secondary variant and md size", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain(styles.variant.secondary);
    expect(button.className).toContain(styles.size.md);
  });
});
