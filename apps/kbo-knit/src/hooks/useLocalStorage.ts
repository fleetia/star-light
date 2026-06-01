import { useState, useCallback } from "react";

function getStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStorage<T>(key: string, fallback: T): T {
  try {
    const storage = getStorage();
    if (!storage) return fallback;

    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    if (
      typeof fallback === "object" &&
      fallback !== null &&
      !Array.isArray(fallback)
    ) {
      return { ...fallback, ...parsed };
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T): void {
  try {
    getStorage()?.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private or restricted browsing contexts.
  }
}

export function hasStoredValue(key: string): boolean {
  try {
    const storage = getStorage();
    if (!storage) return false;

    return storage.getItem(key) !== null;
  } catch {
    return false;
  }
}

export function useLocalStorage<T>(
  key: string,
  fallback: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => readStorage(key, fallback));

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState(prev => {
        const next =
          typeof value === "function" ? (value as (prev: T) => T)(prev) : value;
        writeStorage(key, next);
        return next;
      });
    },
    [key]
  );

  return [state, setValue];
}
