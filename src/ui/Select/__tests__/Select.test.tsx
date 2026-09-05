import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "../Select";
import * as styles from "../Select.css";

describe("Select", () => {
  it("renders as a select element", () => {
    render(
      <Select value="a" onChange={vi.fn()}>
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  it("renders children options", () => {
    render(
      <Select value="a" onChange={vi.fn()}>
        <option value="a">Option A</option>
        <option value="b">Option B</option>
      </Select>
    );
    expect(screen.getByText("Option A")).toBeDefined();
    expect(screen.getByText("Option B")).toBeDefined();
  });

  it("reflects the current value", () => {
    render(
      <Select value="b" onChange={vi.fn()}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    expect((screen.getByRole("combobox") as HTMLSelectElement).value).toBe("b");
  });

  it("calls onChange with new value when selection changes", () => {
    const onChange = vi.fn();
    render(
      <Select value="a" onChange={onChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "b" }
    });
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("applies size class", () => {
    render(
      <Select value="a" onChange={vi.fn()} size="lg">
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByRole("combobox").className).toContain(styles.size.lg);
  });

  it("defaults to md size", () => {
    render(
      <Select value="a" onChange={vi.fn()}>
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByRole("combobox").className).toContain(styles.size.md);
  });

  it("applies disabled attribute", () => {
    render(
      <Select value="a" onChange={vi.fn()} disabled>
        <option value="a">A</option>
      </Select>
    );
    expect((screen.getByRole("combobox") as HTMLSelectElement).disabled).toBe(
      true
    );
  });

  it("applies custom className", () => {
    render(
      <Select value="a" onChange={vi.fn()} className="custom">
        <option value="a">A</option>
      </Select>
    );
    expect(screen.getByRole("combobox").className).toContain("custom");
  });

  it("실제 사용 패턴: SeasonSelector — 숫자를 문자열로 변환해서 사용", () => {
    const onChange = vi.fn();
    render(
      <Select
        value={String(2026)}
        onChange={v => onChange(Number(v))}
        size="lg"
      >
        <option value="2026">2026</option>
        <option value="2025">2025</option>
      </Select>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "2025" }
    });
    expect(onChange).toHaveBeenCalledWith(2025);
  });

  it("실제 사용 패턴: TeamSelector — 문자열 코드를 직접 사용", () => {
    const onChange = vi.fn();
    render(
      <Select value="KIA" onChange={onChange} size="lg">
        <option value="KIA">KIA 타이거즈</option>
        <option value="SSG">SSG 랜더스</option>
      </Select>
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "SSG" }
    });
    expect(onChange).toHaveBeenCalledWith("SSG");
  });
});
