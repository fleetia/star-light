import { DEFAULT_STATE } from "../constants/defaults";
import type { AppState } from "../types/game.types";
import {
  backupLocal,
  localKey,
  OWNER_KEY,
  readLegacy,
  readLocal,
  readStored,
  writeStored
} from "./storage";
import type {
  Account,
  CloudSnapshot,
  CloudStore,
  LocalState,
  StateEnvelope,
  SyncStatus
} from "./types";
import {
  compareEnvelopes,
  isAccount,
  isAppState,
  isEnvelope
} from "./validation";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.DEV ? "" : "https://iserlohn.star-light.space")
).replace(/\/$/, "");

export function createCloudStore(): CloudStore {
  const storedOwner = readStored(OWNER_KEY);
  let owner = typeof storedOwner === "string" ? storedOwner : null;
  let local: LocalState = readLocal(owner) ?? {
    state: owner === null ? readLegacy() : DEFAULT_STATE,
    envelope: null,
    initialized: false
  };
  let snapshot: CloudSnapshot = {
    state: local.state,
    account: null,
    status: "checking",
    storageAvailable: true
  };
  let account: Account | null = null;
  let offset = 0;
  let generation = 0;
  let revision = 0;
  let running = false;
  let queued = false;
  let queuedIdentityCheck = false;
  let remoteState: StateEnvelope | null = null;
  let remoteEtag: string | null = null;
  let active = false;
  let loggingOut = false;
  let controller: AbortController | null = null;
  const listeners = new Set<() => void>();

  function publish(status: SyncStatus = snapshot.status): void {
    snapshot = { ...snapshot, state: local.state, account, status };
    listeners.forEach(listener => listener());
  }

  function persist(): void {
    const stateSaved = writeStored(localKey(owner), local);
    const ownerSaved = writeStored(OWNER_KEY, owner);
    snapshot = { ...snapshot, storageAvailable: stateSaved && ownerSaved };
  }

  function invalidate(): void {
    generation += 1;
    queued = false;
    queuedIdentityCheck = false;
    controller?.abort();
  }

  function switchOwner(next: string | null): void {
    if (owner === next) {
      return;
    }
    persist();
    const guestState =
      owner === null
        ? local
        : { state: DEFAULT_STATE, envelope: null, initialized: false };
    owner = next;
    remoteState = null;
    remoteEtag = null;
    local =
      readLocal(owner) ??
      (owner === null
        ? { state: readLegacy(), envelope: null, initialized: false }
        : { ...guestState, initialized: false });
    revision += 1;
    persist();
    publish();
  }

  function stamp(state: AppState): StateEnvelope {
    const correctedNow = Date.now() + offset;
    const previous = local.envelope ? Date.parse(local.envelope.modifiedAt) : 0;
    const modifiedAt =
      previous <= correctedNow + 300_000
        ? Math.max(correctedNow, previous + 1)
        : correctedNow;
    return {
      schemaVersion: 2,
      state,
      modifiedAt: new Date(modifiedAt).toISOString(),
      mutationId: crypto.randomUUID()
    };
  }

  async function responseBody(response: Response): Promise<unknown> {
    return response.json();
  }

  function errorCode(body: unknown): string | null {
    if (
      typeof body === "object" &&
      body !== null &&
      "error" in body &&
      typeof body.error === "string"
    ) {
      return body.error;
    }
    return null;
  }

  async function handleFailure(
    response: Response,
    token: number
  ): Promise<void> {
    const body = await responseBody(response);
    if (token !== generation || !active) {
      return;
    }
    if (response.status === 401) {
      account = null;
      publish(owner === null ? "guest" : "expired");
      return;
    }
    if (response.status === 403) {
      if (account) {
        account = { ...account, supporter: false };
      }
      publish("local");
      return;
    }
    if (response.status === 409 && errorCode(body) === "account_changed") {
      invalidate();
      account = null;
      queued = true;
      queuedIdentityCheck = true;
      publish("checking");
      return;
    }
    publish(errorCode(body) === "clock_skew" ? "clock-error" : "error");
  }

  function replaceState(remote: StateEnvelope): void {
    local = { state: remote.state, envelope: remote, initialized: true };
    persist();
  }

  function acceptRemote(remote: StateEnvelope): void {
    const stored = readLocal(owner);
    if (
      stored?.envelope &&
      (!local.envelope || compareEnvelopes(stored.envelope, local.envelope) > 0)
    ) {
      local = stored;
    }
    if (local.envelope && compareEnvelopes(local.envelope, remote) > 0) {
      return;
    }
    replaceState(remote);
  }

  async function refresh(checkIdentity = true): Promise<void> {
    if (!active || loggingOut) {
      return;
    }
    if (!navigator.onLine) {
      publish("offline");
      return;
    }
    if (running) {
      queued = true;
      queuedIdentityCheck ||= checkIdentity;
      return;
    }
    running = true;
    queued = false;
    queuedIdentityCheck = false;
    const token = generation;
    controller = new AbortController();
    const signal = controller.signal;
    const isCurrent = (): boolean => active && token === generation;
    try {
      if (checkIdentity || !account?.supporter) {
        const startedAt = Date.now();
        const identityResponse = await fetch(`${API_BASE_URL}/v1/me`, {
          credentials: "include",
          cache: "no-store",
          signal
        });
        if (!isCurrent()) {
          return;
        }
        if (!identityResponse.ok) {
          await handleFailure(identityResponse, token);
          return;
        }
        const identity = await responseBody(identityResponse);
        if (!isCurrent()) {
          return;
        }
        if (!isAccount(identity)) {
          publish("error");
          return;
        }
        offset = Date.parse(identity.serverTime) - (startedAt + Date.now()) / 2;
        account = identity;
        switchOwner(identity.sub);
      }
      const identity = account;
      if (!identity) {
        return;
      }
      if (!identity.supporter) {
        publish("local");
        return;
      }
      publish("syncing");
      const initialRevision = revision;
      const headers = { "X-Account-Sub": identity.sub };
      const startedAt = Date.now();
      const cloudResponse = await fetch(`${API_BASE_URL}/v1/state`, {
        credentials: "include",
        cache: "no-store",
        signal,
        headers: {
          ...headers,
          ...(remoteEtag ? { "If-None-Match": remoteEtag } : {})
        }
      });
      if (!isCurrent()) {
        return;
      }
      const serverTime = cloudResponse.headers.get("x-server-time");
      if (serverTime && Number.isFinite(Date.parse(serverTime))) {
        offset = Date.parse(serverTime) - (startedAt + Date.now()) / 2;
      }
      if (cloudResponse.status === 304 && (!remoteEtag || !remoteState)) {
        publish("error");
        return;
      }
      if (cloudResponse.status !== 304 && !cloudResponse.ok) {
        await handleFailure(cloudResponse, token);
        return;
      }
      if (cloudResponse.status !== 304) {
        const remote = await responseBody(cloudResponse);
        if (!isCurrent()) {
          return;
        }
        const empty =
          typeof remote === "object" &&
          remote !== null &&
          "state" in remote &&
          remote.state === null;
        if (!empty && !isEnvelope(remote)) {
          publish("error");
          return;
        }
        remoteState = isEnvelope(remote) ? remote : null;
        if (remoteState) {
          if (!local.initialized && initialRevision === revision) {
            if (!backupLocal(owner, local)) {
              snapshot = { ...snapshot, storageAvailable: false };
              publish("error");
              return;
            }
            replaceState(remoteState);
          } else {
            acceptRemote(remoteState);
          }
        }
        remoteEtag = cloudResponse.headers.get("etag");
      }
      if (!local.envelope) {
        local = { ...local, envelope: stamp(local.state), initialized: true };
        persist();
      }
      if (!local.initialized) {
        local = { ...local, initialized: true };
        persist();
      }
      const pending = local.envelope;
      if (
        !pending ||
        (remoteState && compareEnvelopes(pending, remoteState) <= 0)
      ) {
        publish("synced");
        return;
      }
      publish("syncing");
      const savedResponse = await fetch(`${API_BASE_URL}/v1/state`, {
        method: "PUT",
        credentials: "include",
        cache: "no-store",
        signal,
        headers: {
          ...headers,
          "Content-Type": "application/json",
          "X-CSRF-Token": identity.csrfToken
        },
        body: JSON.stringify({
          schemaVersion: pending.schemaVersion,
          state: pending.state,
          modifiedAt: pending.modifiedAt,
          mutationId: pending.mutationId
        })
      });
      if (!isCurrent()) {
        return;
      }
      if (!savedResponse.ok) {
        await handleFailure(savedResponse, token);
        return;
      }
      const saved = await responseBody(savedResponse);
      if (!isCurrent()) {
        return;
      }
      if (!isEnvelope(saved)) {
        publish("error");
        return;
      }
      remoteState = saved;
      remoteEtag = savedResponse.headers.get("etag");
      acceptRemote(saved);
      const hasNewer =
        local.envelope !== null && compareEnvelopes(local.envelope, saved) > 0;
      publish(hasNewer ? "pending" : "synced");
    } catch {
      if (isCurrent()) {
        publish(navigator.onLine ? "error" : "offline");
      }
    } finally {
      running = false;
      if (queued && active) {
        const checkIdentity = queuedIdentityCheck;
        queued = false;
        queuedIdentityCheck = false;
        void refresh(checkIdentity);
      }
    }
  }

  function edit(update: AppState | ((previous: AppState) => AppState)): void {
    const state = typeof update === "function" ? update(local.state) : update;
    if (state === local.state || !isAppState(state)) {
      return;
    }
    revision += 1;
    local = { ...local, state, envelope: stamp(state) };
    persist();
    publish(
      navigator.onLine
        ? account?.supporter
          ? "pending"
          : snapshot.status
        : "offline"
    );
  }

  async function logout(): Promise<void> {
    if (!account || loggingOut) {
      return;
    }
    invalidate();
    loggingOut = true;
    const token = generation;
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
        headers: {
          "X-CSRF-Token": account.csrfToken,
          "X-Account-Sub": account.sub
        }
      });
      if (token !== generation || !active) {
        return;
      }
      if (!response.ok) {
        publish("error");
        return;
      }
      account = null;
      switchOwner(null);
      publish("guest");
    } catch {
      if (token === generation && active) {
        publish(navigator.onLine ? "error" : "offline");
      }
    } finally {
      loggingOut = false;
    }
  }

  function start(): () => void {
    active = true;
    const wake = (): void => {
      void refresh();
    };
    const offline = (): void => {
      publish("offline");
    };
    let wasAway = false;
    const away = (): void => {
      wasAway = true;
    };
    const returned = (): void => {
      if (document.visibilityState === "visible" && wasAway) {
        wasAway = false;
        wake();
      }
    };
    const visibility = (): void => {
      if (document.visibilityState === "hidden") {
        away();
      } else {
        returned();
      }
    };
    const poll = (): void => {
      if (document.visibilityState === "visible") {
        void refresh(false);
      }
    };
    const storage = (event: StorageEvent): void => {
      if (event.key === localKey(owner)) {
        const stored = readLocal(owner);
        if (
          stored?.envelope &&
          (!local.envelope ||
            compareEnvelopes(stored.envelope, local.envelope) > 0)
        ) {
          local = stored;
          revision += 1;
          publish(navigator.onLine ? "pending" : "offline");
        }
      }
      if (event.key === OWNER_KEY) {
        wake();
      }
    };
    window.addEventListener("online", wake);
    window.addEventListener("offline", offline);
    window.addEventListener("blur", away);
    window.addEventListener("focus", returned);
    window.addEventListener("storage", storage);
    document.addEventListener("visibilitychange", visibility);
    const interval = setInterval(poll, 60_000);
    wake();
    return () => {
      active = false;
      invalidate();
      clearInterval(interval);
      window.removeEventListener("online", wake);
      window.removeEventListener("offline", offline);
      window.removeEventListener("blur", away);
      window.removeEventListener("focus", returned);
      window.removeEventListener("storage", storage);
      document.removeEventListener("visibilitychange", visibility);
    };
  }

  return {
    getSnapshot: () => snapshot,
    subscribe: listener => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    start,
    edit,
    refresh,
    logout
  };
}
