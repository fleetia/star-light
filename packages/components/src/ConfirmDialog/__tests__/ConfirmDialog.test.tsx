import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ConfirmDialog } from "../ConfirmDialog";

describe("ConfirmDialog", () => {
  const defaultProps = {
    isOpen: true,
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    title: "Delete item",
    message: "Are you sure?"
  };

  it("renders nothing when isOpen is false", () => {
    const { container } = render(
      <ConfirmDialog {...defaultProps} isOpen={false} />
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders title and message when open", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Delete item")).toBeDefined();
    expect(screen.getByText("Are you sure?")).toBeDefined();
  });

  it("has role=alertdialog", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("alertdialog")).toBeDefined();
  });

  it("has aria-modal=true", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("alertdialog").getAttribute("aria-modal")).toBe(
      "true"
    );
  });

  it("has aria-describedby linked to message", () => {
    render(<ConfirmDialog {...defaultProps} />);
    const dialog = screen.getByRole("alertdialog");
    const describedBy = dialog.getAttribute("aria-describedby");
    expect(describedBy).toBeDefined();
    const messageEl = document.getElementById(describedBy!);
    expect(messageEl?.textContent).toBe("Are you sure?");
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText("확인"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("calls onCancel when cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("취소"));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders custom confirm and cancel labels", () => {
    render(
      <ConfirmDialog {...defaultProps} confirmLabel="Yes" cancelLabel="No" />
    );
    expect(screen.getByText("Yes")).toBeDefined();
    expect(screen.getByText("No")).toBeDefined();
  });

  it("calls onCancel when overlay is clicked", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <ConfirmDialog {...defaultProps} onCancel={onCancel} />
    );
    const overlay = container.firstElementChild as HTMLElement;
    fireEvent.click(overlay);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
