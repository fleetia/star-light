import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Box } from "../Box";

describe("Box", () => {
  it("renders children", () => {
    render(
      <Box>
        <p>Content</p>
      </Box>
    );
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("renders title when provided", () => {
    render(
      <Box title="Settings">
        <p>Content</p>
      </Box>
    );
    expect(screen.getByText("Settings")).toBeDefined();
  });

  it("has role=group when title is provided", () => {
    render(
      <Box title="Settings">
        <p>Content</p>
      </Box>
    );
    expect(screen.getByRole("group")).toBeDefined();
  });

  it("has aria-labelledby linked to title", () => {
    render(
      <Box title="Settings">
        <p>Content</p>
      </Box>
    );
    const group = screen.getByRole("group");
    const titleId = group.getAttribute("aria-labelledby");
    expect(titleId).toBeDefined();
    const titleEl = document.getElementById(titleId!);
    expect(titleEl?.textContent).toBe("Settings");
  });

  it("has no role when title is not provided", () => {
    const { container } = render(
      <Box>
        <p>Content</p>
      </Box>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.getAttribute("role")).toBeNull();
  });

  it("has no aria-labelledby when title is not provided", () => {
    const { container } = render(
      <Box>
        <p>Content</p>
      </Box>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.getAttribute("aria-labelledby")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <Box className="custom">
        <p>Content</p>
      </Box>
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.className).toContain("custom");
  });
});
