import { DEFAULT_STATE, STORAGE_KEY } from "../constants/defaults";
import type { AppState } from "../types/game.types";
import type { LocalState } from "./types";
import { isAppState, isEnvelope } from "./validation";

const PREFIX = `${STORAGE_KEY}:cloud:v2`;
export const OWNER_KEY = `${PREFIX}:owner`;

export function readStored(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function localKey(owner: string | null): string {
  return owner === null
    ? `${PREFIX}:guest`
    : `${PREFIX}:user:${encodeURIComponent(owner)}`;
}

export function readLocal(owner: string | null): LocalState | null {
  const value = readStored(localKey(owner));
  if (
    typeof value !== "object" ||
    value === null ||
    !("state" in value) ||
    !isAppState(value.state) ||
    !("envelope" in value) ||
    (value.envelope !== null && !isEnvelope(value.envelope)) ||
    !("initialized" in value) ||
    typeof value.initialized !== "boolean"
  ) {
    return null;
  }
  return {
    state: value.envelope?.state ?? value.state,
    envelope: value.envelope,
    initialized: value.initialized
  };
}

export function readLegacy(): AppState {
  const value = readStored(STORAGE_KEY);
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return DEFAULT_STATE;
  }
  if (readStored(`${PREFIX}:legacy-backup`) === null) {
    writeStored(`${PREFIX}:legacy-backup`, value);
  }
  const colors =
    "colors" in value &&
    typeof value.colors === "object" &&
    value.colors !== null
      ? value.colors
      : {};
  const candidate = {
    ...DEFAULT_STATE,
    ...value,
    colors: { ...DEFAULT_STATE.colors, ...colors },
    cancelRowCount:
      "cancelRowCount" in value
        ? (value.cancelRowCount ?? DEFAULT_STATE.cancelRowCount)
        : DEFAULT_STATE.cancelRowCount
  };
  if (!isAppState(candidate)) {
    return DEFAULT_STATE;
  }
  return candidate;
}

export function backupLocal(owner: string | null, local: LocalState): boolean {
  return writeStored(`${localKey(owner)}:backup:${crypto.randomUUID()}`, local);
}
