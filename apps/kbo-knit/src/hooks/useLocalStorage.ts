import { useState, useCallback } from "react";

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
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
  localStorage.setItem(key, JSON.stringify(value));
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
