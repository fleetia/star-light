import { act, renderHook } from "@star-light/test-utils";
import { describe, expect, it, vi } from "vitest";
import { hasStoredValue, useLocalStorage } from "../useLocalStorage";

describe("useLocalStorage", () => {
  it("falls back when storage cannot be read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    const { result } = renderHook(() => useLocalStorage("blocked", "fallback"));

    expect(result.current[0]).toBe("fallback");
    expect(hasStoredValue("blocked")).toBe(false);
  });

  it("treats missing storage as no stored value", () => {
    vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
      throw new Error("blocked");
    });

    expect(hasStoredValue("blocked")).toBe(false);
  });

  it("keeps in-memory state when storage cannot be written", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });

    const { result } = renderHook(() => useLocalStorage("blocked", 1));

    act(() => {
      result.current[1](2);
    });

    expect(result.current[0]).toBe(2);
  });
});
