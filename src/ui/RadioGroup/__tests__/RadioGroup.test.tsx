import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { RadioGroup } from "../RadioGroup";

const options = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
  { value: "c", label: "Option C" }
];

describe("RadioGroup", () => {
  it("renders radiogroup role", () => {
    render(<RadioGroup options={options} value="a" onChange={() => {}} />);
    expect(screen.getByRole("radiogroup")).toBeDefined();
  });

  it("renders all options as radio buttons", () => {
    render(<RadioGroup options={options} value="a" onChange={() => {}} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("checks the radio matching value prop", () => {
    render(<RadioGroup options={options} value="b" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].checked).toBe(false);
    expect(radios[1].checked).toBe(true);
    expect(radios[2].checked).toBe(false);
  });

  it("calls onChange with selected value", () => {
    const onChange = vi.fn();
    render(<RadioGroup options={options} value="a" onChange={onChange} />);
    fireEvent.click(screen.getAllByRole("radio")[2]);
    expect(onChange).toHaveBeenCalledWith("c");
  });

  it("disables all radios when group disabled", () => {
    render(
      <RadioGroup options={options} value="a" onChange={() => {}} disabled />
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios.every(r => r.disabled)).toBe(true);
  });

  it("disables individual option", () => {
    const opts = [
      { value: "a", label: "A" },
      { value: "b", label: "B", disabled: true }
    ];
    render(<RadioGroup options={opts} value="a" onChange={() => {}} />);
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios[0].disabled).toBe(false);
    expect(radios[1].disabled).toBe(true);
  });

  it("renders label text", () => {
    render(<RadioGroup options={options} value="a" onChange={() => {}} />);
    expect(screen.getByText("Option A")).toBeDefined();
    expect(screen.getByText("Option B")).toBeDefined();
  });

  it("applies custom className", () => {
    render(
      <RadioGroup
        options={options}
        value="a"
        onChange={() => {}}
        className="custom"
      />
    );
    expect(screen.getByRole("radiogroup").className).toContain("custom");
  });

  it("uses custom name attribute", () => {
    render(
      <RadioGroup
        name="my-group"
        options={options}
        value="a"
        onChange={() => {}}
      />
    );
    const radios = screen.getAllByRole("radio") as HTMLInputElement[];
    expect(radios.every(r => r.name === "my-group")).toBe(true);
  });

  describe("real usage: kbo-knit RowCounter 메리야스뜨기", () => {
    const stockinetteOptions = [
      { value: "odd", label: "홀수단 겉뜨기" },
      { value: "even", label: "짝수단 겉뜨기" }
    ];

    it("boolean → string 변환 패턴으로 사용", () => {
      const onChange = vi.fn();
      render(
        <RadioGroup
          name="stockinette"
          options={stockinetteOptions}
          value="odd"
          onChange={onChange}
        />
      );
      fireEvent.click(screen.getByLabelText("짝수단 겉뜨기"));
      expect(onChange).toHaveBeenCalledWith("even");
    });

    it("2개 옵션에서 선택 상태 확인", () => {
      render(
        <RadioGroup
          name="stockinette"
          options={stockinetteOptions}
          value="even"
          onChange={() => {}}
        />
      );
      const radios = screen.getAllByRole("radio") as HTMLInputElement[];
      expect(radios[0].checked).toBe(false);
      expect(radios[1].checked).toBe(true);
    });
  });
});
