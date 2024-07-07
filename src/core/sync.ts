export type SyncStatus = 'SYNCED' | 'UPDATED' | 'DELETED';

export interface SyncResponse {
  syncId: number;
  syncVersion: number;
}

export abstract class Sync {
  syncStatus: SyncStatus;
  syncVersion: number;
  syncId: number | null;

  public abstract fetch(): void;

  public abstract push(): void;
}
