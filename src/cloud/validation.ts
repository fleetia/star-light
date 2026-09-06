import { TEAM_COLORS } from "../constants/teams";
import type { AppState, Game } from "../types/game.types";
import type { Account, StateEnvelope } from "./types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCount(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isTeam(value: unknown): boolean {
  return typeof value === "string" && Object.hasOwn(TEAM_COLORS, value);
}

function isSeries(value: unknown): boolean {
  return (
    value === "PRESEASON" ||
    value === "REGULAR_SEASON" ||
    value === "POSTSEASON"
  );
}

function isChecks(value: unknown): boolean {
  return (
    isRecord(value) &&
    Object.values(value).every(item => typeof item === "boolean")
  );
}

function isGame(value: unknown): value is Game {
  return (
    isRecord(value) &&
    typeof value.gameKey === "string" &&
    value.gameKey.length > 0 &&
    typeof value.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value.date) &&
    isSeries(value.seriesType) &&
    isTeam(value.awayTeam) &&
    isTeam(value.homeTeam) &&
    (value.awayScore === null || isCount(value.awayScore)) &&
    (value.homeScore === null || isCount(value.homeScore)) &&
    (value.status === undefined || value.status === "cancelled")
  );
}

export function isAppState(value: unknown): value is AppState {
  if (!isRecord(value) || !isRecord(value.colors)) {
    return false;
  }
  const colors = value.colors;
  const colorKeys = [
    "homeWin",
    "homeDraw",
    "homeLoss",
    "homeCancel",
    "awayWin",
    "awayDraw",
    "awayLoss",
    "awayCancel"
  ];
  return (
    isCount(value.season) &&
    value.season >= 1982 &&
    value.season <= 9999 &&
    isTeam(value.team) &&
    typeof value.awaySame === "boolean" &&
    Array.isArray(value.series) &&
    value.series.length > 0 &&
    value.series.every(isSeries) &&
    colorKeys.every(
      key =>
        typeof colors[key] === "string" && /^#[\da-f]{6}$/i.test(colors[key])
    ) &&
    isChecks(value.checked) &&
    (value.checkedMap === undefined ||
      (isRecord(value.checkedMap) &&
        Object.values(value.checkedMap).every(isChecks))) &&
    ["perGame", "perScore", "perOpScore", "perDiff"].includes(
      String(value.rowMode)
    ) &&
    isCount(value.rowCount) &&
    isCount(value.cancelRowCount) &&
    Array.isArray(value.customGames) &&
    value.customGames.every(isGame) &&
    (value.activeTab === undefined ||
      ["pattern", "guide", "counter", "options"].includes(
        String(value.activeTab)
      )) &&
    (value.checkTiming === undefined ||
      value.checkTiming === "start" ||
      value.checkTiming === "end") &&
    (value.stockinetteEnabled === undefined ||
      typeof value.stockinetteEnabled === "boolean") &&
    (value.stockinetteOddKnit === undefined ||
      typeof value.stockinetteOddKnit === "boolean")
  );
}

export function isTimestamp(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    Number.isFinite(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

export function isEnvelope(value: unknown): value is StateEnvelope {
  return (
    isRecord(value) &&
    value.schemaVersion === 2 &&
    isAppState(value.state) &&
    isTimestamp(value.modifiedAt) &&
    typeof value.mutationId === "string" &&
    value.mutationId.length > 0 &&
    value.mutationId.length <= 128 &&
    (value.updatedAt === undefined || isTimestamp(value.updatedAt))
  );
}

export function isAccount(value: unknown): value is Account {
  return (
    isRecord(value) &&
    typeof value.sub === "string" &&
    value.sub.length > 0 &&
    (value.email === null || typeof value.email === "string") &&
    (value.username === undefined ||
      value.username === null ||
      typeof value.username === "string") &&
    ((typeof value.username === "string" && value.username.length > 0) ||
      (typeof value.email === "string" && value.email.length > 0)) &&
    typeof value.supporter === "boolean" &&
    (!Object.hasOwn(value, "cloudSyncEnabled") ||
      typeof value.cloudSyncEnabled === "boolean") &&
    (!Object.hasOwn(value, "nickname") ||
      value.nickname === null ||
      (typeof value.nickname === "string" &&
        value.nickname.trim().length > 0)) &&
    (value.grantedAt === null || isTimestamp(value.grantedAt)) &&
    typeof value.csrfToken === "string" &&
    value.csrfToken.length > 0 &&
    isTimestamp(value.serverTime)
  );
}

export function compareEnvelopes(
  left: StateEnvelope,
  right: StateEnvelope
): number {
  const difference = Date.parse(left.modifiedAt) - Date.parse(right.modifiedAt);
  if (difference !== 0) {
    return difference;
  }
  return left.mutationId < right.mutationId
    ? -1
    : Number(left.mutationId > right.mutationId);
}
