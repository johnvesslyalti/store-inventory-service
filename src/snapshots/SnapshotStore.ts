export const SnapshotStore: Record<string, Record<string, any>> = {};

export function saveSnapshot(brand: string, storeId: string, snapshot: any) {
  if (!SnapshotStore[brand]) SnapshotStore[brand] = {};
  SnapshotStore[brand][storeId] = snapshot;
}

export function getSnapshot(brand: string, storeId: string) {
  return SnapshotStore[brand]?.[storeId] ?? null;
}
