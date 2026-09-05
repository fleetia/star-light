import { describe, it, expect, beforeEach } from "vitest";
import { setCSSVariable, setCSSVariables } from "../cssVariable";

describe("setCSSVariable", () => {
  beforeEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("CSS 변수를 document root에 설정한다", () => {
    setCSSVariable("--color-primary", "#ff0000");
    expect(
      document.documentElement.style.getPropertyValue("--color-primary")
    ).toBe("#ff0000");
  });

  it("기존 값을 덮어쓴다", () => {
    setCSSVariable("--gap", "10px");
    setCSSVariable("--gap", "20px");
    expect(document.documentElement.style.getPropertyValue("--gap")).toBe(
      "20px"
    );
  });

  it("빈 문자열 값도 설정 가능하다", () => {
    setCSSVariable("--test", "");
    expect(document.documentElement.style.getPropertyValue("--test")).toBe("");
  });
});

describe("setCSSVariables", () => {
  beforeEach(() => {
    document.documentElement.style.cssText = "";
  });

  it("여러 CSS 변수를 한번에 설정한다", () => {
    setCSSVariables({
      "--color-bg": "#ffffff",
      "--color-text": "#333333",
      "--font-size": "16px"
    });

    expect(document.documentElement.style.getPropertyValue("--color-bg")).toBe(
      "#ffffff"
    );
    expect(
      document.documentElement.style.getPropertyValue("--color-text")
    ).toBe("#333333");
    expect(document.documentElement.style.getPropertyValue("--font-size")).toBe(
      "16px"
    );
  });

  it("빈 객체는 아무것도 설정하지 않는다", () => {
    setCSSVariables({});
    expect(document.documentElement.style.cssText).toBe("");
  });
});
