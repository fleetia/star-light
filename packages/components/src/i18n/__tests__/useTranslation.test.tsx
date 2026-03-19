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
    expect(result.current.t("confirmDialog.confirm")).toBe("확인");
  });

  it("I18nProvider로 en locale을 지정하면 영어 번역을 반환한다", () => {
    const { result } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <I18nProvider locale="en">{children}</I18nProvider>
      )
    });

    expect(result.current.locale).toBe("en");
    expect(result.current.t("modal.close")).toBe("Close");
    expect(result.current.t("confirmDialog.confirm")).toBe("Confirm");
    expect(result.current.t("confirmDialog.cancel")).toBe("Cancel");
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

    expect(result.current.t("sidebar.save")).toBe("저장");

    currentLocale = "en";
    rerender();
    expect(result.current.t("sidebar.save")).toBe("Save");

    currentLocale = "ja";
    rerender();
    expect(result.current.t("sidebar.save")).toBe("保存");
  });

  it("실제 컴포넌트 패턴: ConfirmDialog에서 사용하는 키들이 모든 locale에서 번역된다", () => {
    const keys = ["confirmDialog.confirm", "confirmDialog.cancel"] as const;

    const locales: Locale[] = ["ko", "en", "ja"];

    for (const locale of locales) {
      const { result } = renderHook(() => useTranslation(), {
        wrapper: ({ children }) => (
          <I18nProvider locale={locale}>{children}</I18nProvider>
        )
      });

      for (const key of keys) {
        const translated = result.current.t(key);
        expect(translated).toBeTruthy();
        expect(translated).not.toBe(key);
      }
    }
  });

  it("실제 컴포넌트 패턴: Modal의 close 버튼 aria-label이 locale별로 다르다", () => {
    const { result: ko } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <I18nProvider locale="ko">{children}</I18nProvider>
      )
    });
    const { result: en } = renderHook(() => useTranslation(), {
      wrapper: ({ children }) => (
        <I18nProvider locale="en">{children}</I18nProvider>
      )
    });

    expect(ko.current.t("modal.close")).toBe("닫기");
    expect(en.current.t("modal.close")).toBe("Close");
    expect(ko.current.t("modal.close")).not.toBe(en.current.t("modal.close"));
  });
});
