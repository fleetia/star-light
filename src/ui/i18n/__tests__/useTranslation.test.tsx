import React from "react";
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useTranslation } from "../context";
import { I18nProvider } from "../I18nProvider";
import type { Locale } from "../types";

describe("useTranslation", () => {
  it("Provider 없이 사용하면 ko 기본값을 반환한다", () => {
    const { result } = renderHook(() => useTranslation());

    expect(result.current.locale).toBe("ko");
    expect(result.current.t("modal.close")).toBe("닫기");
  });

  it("I18nProvider로 en locale을 지정하면 영어 번역을 반환한다", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <I18nProvider locale="en">{children}</I18nProvider>
      )
    });

    expect(result.current.locale).toBe("en");
    expect(result.current.t("modal.close")).toBe("Close");
  });

  it("I18nProvider로 ja locale을 지정하면 일본어 번역을 반환한다", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <I18nProvider locale="ja">{children}</I18nProvider>
      )
    });

    expect(result.current.locale).toBe("ja");
    expect(result.current.t("modal.close")).toBe("閉じる");
  });

  it("locale이 변경되면 번역이 전환된다", () => {
    let currentLocale: Locale = "ko";

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nProvider locale={currentLocale}>{children}</I18nProvider>
    );

    const { result, rerender } = renderHook(() => useTranslation(), {
      wrapper
    });

    expect(result.current.t("modal.close")).toBe("닫기");

    currentLocale = "en";
    rerender();
    expect(result.current.t("modal.close")).toBe("Close");

    currentLocale = "ja";
    rerender();
    expect(result.current.t("modal.close")).toBe("閉じる");
  });
});
