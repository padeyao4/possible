import { type SyncStatus } from '@/core/sync';
import { v4 } from 'uuid';
import { emitter } from '@/utils';

export class Backlog {
  private readonly _id: string;
  private _title: string;
  private _orderIndex: number;
  private _createdAt: Date;
  private _completeAt: Date | null;
  private _done: boolean;

  sid: number | null;
  status: SyncStatus;
  version: number;

  constructor() {
    const now = new Date();
    this._id = v4();
    this._title = '';
    this._orderIndex = now.getTime();
    this._createdAt = now;
    this._completeAt = null;
    this._done = false;
    this.sid = null;
    this.status = 'UPDATED';
    this.version = 0;
  }

  get id(): string {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }

  get orderIndex(): number {
    return this._orderIndex;
  }

  set orderIndex(value: number) {
    this._orderIndex = value;
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  set createdAt(value: Date) {
    this._createdAt = value;
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }

  get completeAt(): Date | null {
    return this._completeAt;
  }

  set completeAt(value: Date | null) {
    this._completeAt = value;
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }

  get done(): boolean {
    return this._done;
  }

  set done(value: boolean) {
    this._done = value;
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }
}
