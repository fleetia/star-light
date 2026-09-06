import { describe, expect, it } from "vitest";
import { DEFAULT_STATE } from "../../constants/defaults";
import {
  compareEnvelopes,
  isAccount,
  isAppState,
  isEnvelope
} from "../validation";
import type { StateEnvelope } from "../types";

describe("cloud validation", () => {
  it("accepts current saved state and rejects malformed nested state", () => {
    expect(isAppState(DEFAULT_STATE)).toBe(true);
    expect(
      isAppState({
        ...DEFAULT_STATE,
        checkedMap: { "2026-HANWHA": { game: "yes" } }
      })
    ).toBe(false);
    expect(
      isAppState({
        ...DEFAULT_STATE,
        colors: {
          ...DEFAULT_STATE.colors,
          homeWin: "url(https://example.test)"
        }
      })
    ).toBe(false);
    expect(
      isAppState({ ...DEFAULT_STATE, customGames: [{ gameKey: "bad" }] })
    ).toBe(false);
  });

  it("requires a full account and valid envelope before trusting API data", () => {
    const envelope: StateEnvelope = {
      schemaVersion: 2,
      state: DEFAULT_STATE,
      modifiedAt: "2026-09-05T10:00:00.000Z",
      mutationId: "mutation-a"
    };
    expect(isEnvelope(envelope)).toBe(true);
    expect(isEnvelope({ ...envelope, modifiedAt: "not a date" })).toBe(false);
    expect(
      isAccount({
        sub: "a",
        email: "a@example.test",
        supporter: false,
        grantedAt: null,
        csrfToken: "csrf",
        serverTime: envelope.modifiedAt
      })
    ).toBe(true);
    expect(isAccount({ sub: "a", supporter: "true" })).toBe(false);
    const account = {
      sub: "username-user",
      username: "knitter",
      email: null,
      supporter: false,
      grantedAt: null,
      csrfToken: "csrf",
      serverTime: envelope.modifiedAt
    };
    expect(isAccount(account)).toBe(true);
    expect(
      isAccount({ ...account, cloudSyncEnabled: true, nickname: "뜨개팬" })
    ).toBe(true);
    expect(
      isAccount({ ...account, cloudSyncEnabled: false, nickname: null })
    ).toBe(true);
    expect(isAccount({ ...account, cloudSyncEnabled: "true" })).toBe(false);
    expect(isAccount({ ...account, cloudSyncEnabled: null })).toBe(false);
    expect(isAccount({ ...account, cloudSyncEnabled: undefined })).toBe(false);
    expect(isAccount({ ...account, nickname: 123 })).toBe(false);
    expect(isAccount({ ...account, nickname: " " })).toBe(false);
    expect(isAccount({ ...account, username: null })).toBe(false);
    expect(isAccount({ ...account, email: 123 })).toBe(false);
  });

  it("orders by editing time instead of upload time, with a deterministic mutation tie-break", () => {
    const earlier: StateEnvelope = {
      schemaVersion: 2,
      state: DEFAULT_STATE,
      modifiedAt: "2026-09-05T10:00:00.000Z",
      mutationId: "b",
      updatedAt: "2026-09-06T10:00:00.000Z"
    };
    const later = {
      ...earlier,
      modifiedAt: "2026-09-05T11:00:00.000Z",
      updatedAt: "2026-09-05T11:00:00.000Z"
    };
    expect(compareEnvelopes(earlier, later)).toBeLessThan(0);
    expect(
      compareEnvelopes(earlier, { ...earlier, mutationId: "a" })
    ).toBeGreaterThan(0);
    expect(compareEnvelopes(earlier, earlier)).toBe(0);
  });
});
