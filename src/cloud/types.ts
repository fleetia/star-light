import type { AppState } from "../types/game.types";

export type StateEnvelope = {
  schemaVersion: 2;
  state: AppState;
  modifiedAt: string;
  mutationId: string;
  updatedAt?: string;
};

export type Account = {
  sub: string;
  username?: string | null;
  email: string | null;
  supporter: boolean;
  grantedAt: string | null;
  csrfToken: string;
  serverTime: string;
};

export type SyncStatus =
  | "checking"
  | "guest"
  | "local"
  | "pending"
  | "syncing"
  | "synced"
  | "offline"
  | "expired"
  | "clock-error"
  | "error";

export type LocalState = {
  state: AppState;
  envelope: StateEnvelope | null;
  initialized: boolean;
};

export type CloudSnapshot = {
  state: AppState;
  account: Account | null;
  status: SyncStatus;
  storageAvailable: boolean;
};

export type CloudStore = {
  getSnapshot: () => CloudSnapshot;
  subscribe: (listener: () => void) => () => void;
  start: () => () => void;
  edit: (update: AppState | ((previous: AppState) => AppState)) => void;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};
