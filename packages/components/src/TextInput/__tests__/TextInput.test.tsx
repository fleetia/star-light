import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TextInput } from "../TextInput";

describe("TextInput", () => {
  it("renders an input element", () => {
    render(<TextInput value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeDefined();
  });

  it("renders label when provided", () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    expect(screen.getByText("Name")).toBeDefined();
  });

  it("has label linked to input via htmlFor", () => {
    render(<TextInput label="Name" value="" onChange={() => {}} />);
    const input = screen.getByRole("textbox");
    const label = screen.getByText("Name");
    expect(label.getAttribute("for")).toBe(input.id);
  });

  it("renders placeholder", () => {
    render(<TextInput placeholder="Enter name" value="" onChange={() => {}} />);
    expect(screen.getByPlaceholderText("Enter name")).toBeDefined();
  });

  it("reflects value", () => {
    render(<TextInput value="hello" onChange={() => {}} />);
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.value).toBe("hello");
  });

  it("calls onChange with new value", () => {
    const onChange = vi.fn();
    render(<TextInput value="" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test" }
    });
    expect(onChange).toHaveBeenCalledWith("test");
  });

  it("renders error message with role=alert", () => {
    render(<TextInput value="" onChange={() => {}} error="Required field" />);
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Required field")).toBeDefined();
  });

  it("has aria-invalid when error exists", () => {
    render(<TextInput value="" onChange={() => {}} error="Required" />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe(
      "true"
    );
  });

  it("has aria-describedby linked to error", () => {
    render(<TextInput value="" onChange={() => {}} error="Required" />);
    const input = screen.getByRole("textbox");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeDefined();
    const errorEl = document.getElementById(describedBy!);
    expect(errorEl?.textContent).toBe("Required");
  });

  it("has no aria-invalid without error", () => {
    render(<TextInput value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBeNull();
  });

  it("applies custom className", () => {
    const { container } = render(
      <TextInput value="" onChange={() => {}} className="custom" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("custom");
  });
});
