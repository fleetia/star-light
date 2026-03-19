import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { IconButton } from "../IconButton";
import * as styles from "../IconButton.css";

describe("IconButton", () => {
  describe("normal type", () => {
    it("renders the name", () => {
      render(<IconButton type="normal" name="Chrome" />);
      expect(screen.getByText("Chrome")).toBeDefined();
    });

    it("renders the first letter when no iconUrl", () => {
      render(<IconButton type="normal" name="Chrome" />);
      expect(screen.getByText("C")).toBeDefined();
    });

    it("renders an img when iconUrl is provided", () => {
      const { container } = render(
        <IconButton
          type="normal"
          name="Chrome"
          iconUrl="https://example.com/icon.png"
        />
      );
      const img = container.querySelector("img");
      expect(img).toBeDefined();
      expect(img!.getAttribute("src")).toBe("https://example.com/icon.png");
    });

    it("calls onClick when clicked", () => {
      const onClick = vi.fn();
      render(<IconButton type="normal" name="Chrome" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onContextMenu on right-click", () => {
      const onContextMenu = vi.fn();
      render(
        <IconButton type="normal" name="Chrome" onContextMenu={onContextMenu} />
      );
      fireEvent.contextMenu(screen.getByRole("button"));
      expect(onContextMenu).toHaveBeenCalledTimes(1);
    });

    it("sets aria-label to the name", () => {
      render(<IconButton type="normal" name="Chrome" />);
      expect(screen.getByRole("button").getAttribute("aria-label")).toBe(
        "Chrome"
      );
    });
  });

  describe("folder type", () => {
    it("renders the folder name", () => {
      render(<IconButton type="folder" name="Games" />);
      expect(screen.getByText("Games")).toBeDefined();
    });

    it("renders an SVG fallback when no icon is provided", () => {
      const { container } = render(<IconButton type="folder" name="Games" />);
      expect(container.querySelector("svg")).toBeDefined();
    });

    it("renders an img when iconUrl is provided", () => {
      const { container } = render(
        <IconButton
          type="folder"
          name="Games"
          iconUrl="https://example.com/folder.png"
        />
      );
      expect(container.querySelector("img")).toBeDefined();
    });

    it("applies folder class", () => {
      const { container } = render(<IconButton type="folder" name="Games" />);
      expect(container.querySelector("button")!.className).toContain(
        styles.folder
      );
    });
  });

  describe("empty type", () => {
    it("renders the add symbol", () => {
      const { container } = render(<IconButton type="empty" />);
      const iconDiv = container.querySelector("button div");
      expect(iconDiv!.textContent).toBe("+");
    });

    it("renders add label", () => {
      render(<IconButton type="empty" />);
      expect(screen.getByText("추가")).toBeDefined();
    });

    it("calls onClick when clicked", () => {
      const onClick = vi.fn();
      render(<IconButton type="empty" onClick={onClick} />);
      fireEvent.click(screen.getByRole("button"));
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("layout prop", () => {
    it("applies horizontal class when layout is horizontal", () => {
      const { container } = render(
        <IconButton type="normal" name="Test" layout="horizontal" />
      );
      expect(container.querySelector("button")!.className).toContain(
        styles.horizontal
      );
    });

    it("does not apply horizontal class by default", () => {
      const { container } = render(<IconButton type="normal" name="Test" />);
      expect(container.querySelector("button")!.className).not.toContain(
        styles.horizontal
      );
    });
  });
});
