import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "../Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn()
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <Modal {...defaultProps} isOpen={false}>
        <p>Content</p>
      </Modal>
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders children when open", () => {
    render(
      <Modal {...defaultProps}>
        <p>Modal content</p>
      </Modal>
    );
    expect(screen.getByText("Modal content")).toBeDefined();
  });

  it("has role=dialog", () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("has aria-modal=true", () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByRole("dialog").getAttribute("aria-modal")).toBe("true");
  });

  it("renders title when provided", () => {
    render(
      <Modal {...defaultProps} title="Settings">
        <p>Content</p>
      </Modal>
    );
    expect(screen.getByText("Settings")).toBeDefined();
  });

  it("has aria-labelledby linked to title", () => {
    render(
      <Modal {...defaultProps} title="Settings">
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    const labelledBy = dialog.getAttribute("aria-labelledby");
    expect(labelledBy).toBeDefined();
    const titleEl = document.getElementById(labelledBy!);
    expect(titleEl?.textContent).toBe("Settings");
  });

  it("has no aria-labelledby without title", () => {
    render(
      <Modal {...defaultProps}>
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby")).toBeNull();
  });

  it("renders close button with aria-label when title is provided", () => {
    render(
      <Modal {...defaultProps} title="Settings">
        <p>Content</p>
      </Modal>
    );
    const closeBtn = screen.getByLabelText("닫기");
    expect(closeBtn).toBeDefined();
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <Modal {...defaultProps} onClose={onClose} title="Settings">
        <p>Content</p>
      </Modal>
    );
    fireEvent.click(screen.getByLabelText("닫기"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when overlay is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal {...defaultProps} onClose={onClose}>
        <p>Content</p>
      </Modal>
    );
    const overlay = container.firstElementChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <Modal {...defaultProps} className="custom">
        <p>Content</p>
      </Modal>
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("custom");
  });
});
