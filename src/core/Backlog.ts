import { type Sync, type SyncStatus } from '@/core/sync';
import emitter from '@/utils/emitter';
import { v4 } from 'uuid';

export class Backlog implements Sync {
  private readonly _id: string;
  private _title: string;
  private _orderIndex: number;
  private _createdAt: Date;
  private _completeAt: Date | null;
  private _done: boolean;

  syncId: number | null;
  syncStatus: SyncStatus;
  syncVersion: number;

  constructor() {
    const now = new Date();
    this._id = v4();
    this._title = '';
    this._orderIndex = now.getTime();
    this._createdAt = now;
    this._completeAt = null;
    this._done = false;
    this.syncId = null;
    this.syncStatus = 'UPDATED';
    this.syncVersion = 0;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.syncStatus = 'UPDATED';
    this.push();
  }

  get orderIndex(): number {
    return this._orderIndex;
  }

  set orderIndex(value: number) {
    this._orderIndex = value;
    this.syncStatus = 'UPDATED';
    this.push();
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
    this.syncStatus = 'UPDATED';
    this.push();
  }

  get completeAt(): Date | null {
    return this._completeAt;
  }

  set completeAt(value: Date | null) {
    this._completeAt = value;
    this.syncStatus = 'UPDATED';
    this.push();
  }

  get done(): boolean {
    return this._done;
  }

  set done(value: boolean) {
    this._done = value;
    this.syncStatus = 'UPDATED';
    this.push();
  }

  push() {
    emitter.emit('backlog:push', this);
  }

  fetch() {
    emitter.emit('backlog:fetch', this);
  }
}
