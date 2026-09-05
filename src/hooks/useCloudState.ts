import { useEffect, useState, useSyncExternalStore } from "react";
import { createCloudStore } from "../cloud/store";
import type { CloudSnapshot, CloudStore } from "../cloud/types";

export function useCloudState(): [CloudSnapshot, CloudStore] {
  const [store] = useState(createCloudStore);
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot);
  useEffect(() => store.start(), [store]);
  return [snapshot, store];
}
