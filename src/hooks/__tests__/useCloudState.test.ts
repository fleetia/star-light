import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_STATE, STORAGE_KEY } from "../../constants/defaults";
import type { Account, StateEnvelope } from "../../cloud/types";
import {
  localKey,
  OWNER_KEY,
  readLocal,
  writeStored
} from "../../cloud/storage";
import { useCloudState } from "../useCloudState";

const NOW = "2026-09-05T10:00:00.000Z";

function identity(sub = "user-a"): Account {
  return {
    sub,
    email: `${sub}@example.test`,
    supporter: true,
    grantedAt: NOW,
    csrfToken: "csrf-token",
    serverTime: NOW
  };
}

function envelope(
  rowCount = 2,
  modifiedAt = NOW,
  mutationId = "remote"
): StateEnvelope {
  return {
    schemaVersion: 2,
    state: { ...DEFAULT_STATE, rowCount },
    modifiedAt,
    mutationId,
    updatedAt: NOW
  };
}

function deferredResponse(): {
  promise: Promise<Response>;
  resolve: (response: Response) => void;
} {
  let resolve: (response: Response) => void = () => {};
  const promise = new Promise<Response>(finish => {
    resolve = finish;
  });
  return { promise, resolve };
}

async function settle(): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(0);
  });
}

async function advance(ms = 60_000): Promise<void> {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(NOW);
  localStorage.clear();
  vi.spyOn(navigator, "onLine", "get").mockReturnValue(true);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useCloudState", () => {
  it("syncs a non-supporter account and preserves its nickname", async () => {
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) {
          return Response.json({
            ...identity(),
            supporter: false,
            grantedAt: null,
            cloudSyncEnabled: true,
            nickname: "뜨개팬"
          });
        }
        if (options?.method === "PUT") {
          const saved = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(saved);
          return Response.json(saved);
        }
        return Response.json(envelope());
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    expect(result.current[0].account).toMatchObject({
      supporter: false,
      cloudSyncEnabled: true,
      nickname: "뜨개팬"
    });
    expect(result.current[0].status).toBe("synced");
    act(() => result.current[1].edit(state => ({ ...state, rowCount: 8 })));
    expect(result.current[0].status).toBe("pending");
    await advance();
    expect(writes[0].state.rowCount).toBe(8);
    expect(result.current[0].status).toBe("synced");
  });

  it.each([{ supporter: true, cloudSyncEnabled: false }, { supporter: false }])(
    "keeps sync disabled for account %j",
    async permission => {
      const fetchMock = vi
        .fn<typeof fetch>()
        .mockResolvedValue(Response.json({ ...identity(), ...permission }));
      vi.stubGlobal("fetch", fetchMock);
      const { result } = renderHook(useCloudState);
      await settle();
      expect(result.current[0].status).toBe("local");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    }
  );

  it("pauses sync on a state rejection without changing donation status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async input => {
        if (String(input).endsWith("/me"))
          return Response.json({ ...identity(), cloudSyncEnabled: true });
        return Response.json({ error: "Forbidden" }, { status: 403 });
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    expect(result.current[0].account).toMatchObject({
      supporter: true,
      cloudSyncEnabled: false
    });
    expect(result.current[0].status).toBe("local");
    act(() => result.current[1].edit(state => ({ ...state, rowCount: 8 })));
    expect(result.current[0].status).toBe("local");
    expect(readLocal("user-a")?.state.rowCount).toBe(8);
  });

  it("checks once a minute, preserves 304 state, and uploads only changed local state", async () => {
    let remote = envelope();
    let etag = '"initial"';
    const unchanged = new Response(null, {
      status: 304,
      headers: { "x-server-time": "2026-09-05T10:03:00.000Z" }
    });
    const parseUnchanged = vi.spyOn(unchanged, "json");
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          remote = JSON.parse(String(options.body)) as StateEnvelope;
          etag = '"saved"';
          return Response.json(remote);
        }
        if (new Headers(options?.headers).get("If-None-Match") === etag) {
          return unchanged;
        }
        return Response.json(remote, { headers: { ETag: etag } });
      });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(useCloudState);
    await settle();
    const initialState = result.current[0].state;
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await advance(59_999);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    await advance(1);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result.current[0].state).toBe(initialState);
    expect(parseUnchanged).not.toHaveBeenCalled();
    expect(result.current[0].status).toBe("synced");
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 8 }));
    });
    expect(readLocal("user-a")?.state.rowCount).toBe(8);
    expect(readLocal("user-a")?.envelope?.modifiedAt).toBe(
      "2026-09-05T10:03:00.000Z"
    );
    await advance(59_999);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    await advance(1);
    expect(remote.state.rowCount).toBe(8);
    expect(
      fetchMock.mock.calls.filter(([, options]) => options?.method === "PUT")
    ).toHaveLength(1);
    expect(
      fetchMock.mock.calls.filter(([input]) => String(input).endsWith("/me"))
    ).toHaveLength(1);
    await advance();
    expect(
      new Headers(fetchMock.mock.lastCall?.[1]?.headers).has("If-None-Match")
    ).toBe(false);
    expect(result.current[0].status).toBe("synced");
  });

  it("skips hidden polls and checks identity once on return, including remote account changes", async () => {
    let visible = true;
    let sub = "user-a";
    vi.spyOn(document, "visibilityState", "get").mockImplementation(() =>
      visible ? "visible" : "hidden"
    );
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity(sub));
        expect(options?.method).not.toBe("PUT");
        return Response.json(envelope(sub === "user-a" ? 2 : 11), {
          headers: { ETag: '"' + sub + '"' }
        });
      });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(useCloudState);
    await settle();
    act(() => window.dispatchEvent(new Event("focus")));
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    visible = false;
    act(() => {
      window.dispatchEvent(new Event("blur"));
      document.dispatchEvent(new Event("visibilitychange"));
    });
    await advance();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    sub = "user-b";
    visible = true;
    act(() => {
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
    });
    await settle();
    expect(fetchMock).toHaveBeenCalledTimes(4);
    expect(result.current[0].account?.sub).toBe("user-b");
    expect(result.current[0].state.rowCount).toBe(11);
    expect(
      new Headers(fetchMock.mock.lastCall?.[1]?.headers).has("If-None-Match")
    ).toBe(false);
  });

  it("preserves a newer local edit while a conditional remote read is in flight", async () => {
    const pending = deferredResponse();
    let reads = 0;
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          const body = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(body);
          return Response.json(body);
        }
        reads += 1;
        return reads === 1
          ? Response.json(envelope(), { headers: { ETag: '"initial"' } })
          : pending.promise;
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    await advance();
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 9 }));
    });
    pending.resolve(new Response(null, { status: 304 }));
    await settle();
    expect(result.current[0].state.rowCount).toBe(9);
    expect(writes[0].state.rowCount).toBe(9);
  });

  it("does not treat a failed first upload as legacy on the next login", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_STATE, rowCount: 8 })
    );
    let remote: StateEnvelope | null = null;
    let fail = true;
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me"))
          return Response.json({
            ...identity(),
            serverTime: new Date().toISOString()
          });
        if (options?.method === "PUT") {
          remote = JSON.parse(String(options.body)) as StateEnvelope;
          if (fail) throw new Error("response lost after save");
          return Response.json(remote);
        }
        return Response.json(remote ?? { state: null });
      })
    );
    const first = renderHook(useCloudState);
    await settle();
    expect(first.result.current[0].status).toBe("error");
    act(() => {
      first.result.current[1].edit(state => ({ ...state, rowCount: 9 }));
    });
    const pending = readLocal("user-a")?.envelope;
    first.unmount();
    fail = false;
    const second = renderHook(useCloudState);
    await settle();
    expect(second.result.current[0].state.rowCount).toBe(9);
    expect(second.result.current[0].status).toBe("synced");
    expect(readLocal("user-a")?.envelope?.mutationId).toBe(pending?.mutationId);
  });

  it("preserves a future-clock edit on rejection and corrects only a subsequent user edit", async () => {
    let online = false;
    vi.spyOn(navigator, "onLine", "get").mockImplementation(() => online);
    writeStored(OWNER_KEY, "user-a");
    writeStored(localKey("user-a"), {
      state: DEFAULT_STATE,
      envelope: envelope(1, "2026-09-04T10:00:00.000Z"),
      initialized: true
    });
    vi.setSystemTime("2026-09-05T11:00:00.000Z");
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          const body = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(body);
          return Date.parse(body.modifiedAt) > Date.parse(NOW) + 300_000
            ? Response.json({ error: "clock_skew" }, { status: 409 })
            : Response.json(body);
        }
        return Response.json(envelope(1, "2026-09-04T10:00:00.000Z"));
      })
    );
    const { result } = renderHook(useCloudState);
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 5 }));
    });
    online = true;
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    await settle();
    expect(result.current[0].status).toBe("clock-error");
    const rejected = writes[0];
    await act(async () => {
      await result.current[1].refresh();
    });
    expect(writes[1]).toEqual(rejected);
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 6 }));
    });
    await advance();
    expect(result.current[0].status).toBe("synced");
    expect(writes.at(-1)?.state.rowCount).toBe(6);
    expect(Date.parse(writes.at(-1)?.modifiedAt ?? "")).toBeLessThan(
      Date.parse(rejected.modifiedAt)
    );
  });

  it("uses existing cloud state on first login and preserves the legacy recovery copy", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_STATE, rowCount: 17 })
    );
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async input =>
        Response.json(String(input).endsWith("/me") ? identity() : envelope(3))
      );
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(useCloudState);
    await settle();
    expect(result.current[0].state.rowCount).toBe(3);
    expect(result.current[0].status).toBe("synced");
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null").rowCount
    ).toBe(17);
    expect(
      Object.keys(localStorage).some(key => key.includes("legacy-backup"))
    ).toBe(true);
    expect(
      fetchMock.mock.calls.some(([, options]) => options?.method === "PUT")
    ).toBe(false);
  });

  it("initializes empty cloud from guest state with credentials and account/CSRF binding", async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...DEFAULT_STATE, rowCount: 8 })
    );
    const writes: RequestInit[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          writes.push(options);
          return Response.json(JSON.parse(String(options.body)));
        }
        return Response.json({ state: null });
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    expect(writes).toHaveLength(1);
    expect(writes[0].credentials).toBe("include");
    expect(writes[0].headers).toMatchObject({
      "X-Account-Sub": "user-a",
      "X-CSRF-Token": "csrf-token"
    });
    expect(JSON.parse(String(writes[0].body)).state.rowCount).toBe(8);
    expect(result.current[0].status).toBe("synced");
  });

  it("keeps an in-flight newer edit pending until the next minute", async () => {
    let remote = envelope();
    const pending = deferredResponse();
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me"))
          return Response.json({
            ...identity(),
            serverTime: new Date().toISOString()
          });
        if (options?.method === "PUT") {
          const body = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(body);
          if (writes.length === 1) return pending.promise;
          remote = body;
          return Response.json(body);
        }
        return Response.json(remote);
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    await advance(1);
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 4 }));
    });
    await advance(59_998);
    expect(writes).toHaveLength(0);
    expect(readLocal("user-a")?.state.rowCount).toBe(4);
    await advance(1);
    expect(writes).toHaveLength(1);
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 9 }));
    });
    remote = writes[0];
    pending.resolve(Response.json(remote));
    await settle();
    expect(result.current[0].state.rowCount).toBe(9);
    expect(result.current[0].status).toBe("pending");
    expect(writes).toHaveLength(1);
    await advance(59_999);
    expect(writes).toHaveLength(1);
    await advance(1);
    expect(writes.at(-1)?.state.rowCount).toBe(9);
    expect(writes[0].mutationId).not.toBe(writes.at(-1)?.mutationId);
  });

  it("rechecks an expired cached session before retrying its persisted edit", async () => {
    let authorized = true;
    let remote = envelope();
    const writes: StateEnvelope[] = [];
    const fetchMock = vi
      .fn<typeof fetch>()
      .mockImplementation(async (input, options) => {
        if (!authorized)
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          remote = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(remote);
          return Response.json(remote);
        }
        return Response.json(remote, { headers: { ETag: '"initial"' } });
      });
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(useCloudState);
    await settle();
    act(() => result.current[1].edit(state => ({ ...state, rowCount: 8 })));
    const pending = readLocal("user-a")?.envelope;
    authorized = false;
    await advance();
    expect(result.current[0].status).toBe("expired");
    expect(result.current[0].account).toBeNull();
    expect(writes).toHaveLength(0);
    expect(readLocal("user-a")?.envelope).toEqual(pending);
    authorized = true;
    await advance();
    expect(
      fetchMock.mock.calls.filter(([input]) => String(input).endsWith("/me"))
    ).toHaveLength(2);
    expect(writes[0]).toEqual(pending);
    expect(result.current[0].status).toBe("synced");
  });

  it("preserves an offline edit across session expiry and retries the same mutation", async () => {
    writeStored(OWNER_KEY, "user-a");
    writeStored(localKey("user-a"), {
      state: DEFAULT_STATE,
      envelope: envelope(1),
      initialized: true
    });
    let authorized = false;
    let online = false;
    vi.spyOn(navigator, "onLine", "get").mockImplementation(() => online);
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me"))
          return authorized
            ? Response.json(identity())
            : Response.json({ error: "Unauthorized" }, { status: 401 });
        if (options?.method === "PUT") {
          const body = JSON.parse(String(options.body)) as StateEnvelope;
          writes.push(body);
          return Response.json(body);
        }
        return Response.json(envelope(1, "2026-09-04T10:00:00.000Z"));
      })
    );
    const first = renderHook(useCloudState);
    act(() => {
      first.result.current[1].edit(state => ({ ...state, rowCount: 7 }));
    });
    const saved = readLocal("user-a")?.envelope;
    online = true;
    act(() => {
      window.dispatchEvent(new Event("online"));
    });
    await settle();
    expect(first.result.current[0].status).toBe("expired");
    expect(writes).toHaveLength(0);
    first.unmount();
    authorized = true;
    const second = renderHook(useCloudState);
    await settle();
    expect(second.result.current[0].state.rowCount).toBe(7);
    expect(writes[0].mutationId).toBe(saved?.mutationId);
    expect(writes[0].modifiedAt).toBe(saved?.modifiedAt);
  });

  it("rechecks identity after account_changed without uploading account A data to B", async () => {
    let sub = "user-a";
    const writes: { sub: string | null; state: StateEnvelope }[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity(sub));
        if (options?.method === "PUT") {
          writes.push({
            sub: new Headers(options.headers).get("X-Account-Sub"),
            state: JSON.parse(String(options.body)) as StateEnvelope
          });
          sub = "user-b";
          return Response.json({ error: "account_changed" }, { status: 409 });
        }
        return Response.json(
          envelope(sub === "user-a" ? 2 : 11, "2026-09-04T10:00:00.000Z")
        );
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    act(() => {
      result.current[1].edit(state => ({ ...state, rowCount: 6 }));
    });
    await advance();
    expect(result.current[0].account?.sub).toBe("user-b");
    expect(result.current[0].state.rowCount).toBe(11);
    expect(writes).toHaveLength(1);
    expect(writes[0].sub).toBe("user-a");
    expect(readLocal("user-a")?.state.rowCount).toBe(6);
  });

  it("ignores an in-flight response after logout even when fetch does not honor abort", async () => {
    const pending = deferredResponse();
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async input => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (String(input).endsWith("/logout"))
          return Response.json({ ok: true });
        return pending.promise;
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    await act(async () => {
      await result.current[1].logout();
    });
    pending.resolve(Response.json(envelope(44)));
    await settle();
    expect(result.current[0].account).toBeNull();
    expect(result.current[0].status).toBe("guest");
    expect(result.current[0].state.rowCount).toBe(DEFAULT_STATE.rowCount);
  });

  it("rejects invalid cloud state and keeps a rejected clock-skew mutation unchanged", async () => {
    let invalid = true;
    const writes: StateEnvelope[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn<typeof fetch>().mockImplementation(async (input, options) => {
        if (String(input).endsWith("/me")) return Response.json(identity());
        if (options?.method === "PUT") {
          writes.push(JSON.parse(String(options.body)) as StateEnvelope);
          return Response.json({ error: "clock_skew" }, { status: 409 });
        }
        return Response.json(
          invalid
            ? { ...envelope(), state: { season: "invalid" } }
            : { state: null }
        );
      })
    );
    const { result } = renderHook(useCloudState);
    await settle();
    expect(result.current[0].status).toBe("error");
    expect(writes).toHaveLength(0);
    invalid = false;
    await act(async () => {
      await result.current[1].refresh();
    });
    expect(result.current[0].status).toBe("clock-error");
    await advance(5000);
    await act(async () => {
      await result.current[1].refresh();
    });
    expect(writes[1]).toEqual(writes[0]);
  });
});
