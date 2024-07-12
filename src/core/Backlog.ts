import { type SyncStatus } from '@/core/sync';
import { v4 } from 'uuid';
import { emitter } from '@/utils';

export class Backlog {
  id: string;
  title: string;
  orderIndex: number;
  createdAt: Date;
  completeAt: Date;
  done: boolean;

  sid: number;
  status: SyncStatus;
  version: number;

  constructor() {
    const now = new Date();
    this.id = v4();
    this.title = '';
    this.orderIndex = now.getTime();
    this.createdAt = now;
    this.completeAt = null;
    this.done = false;
    this.sid = null;
    this.status = 'UPDATED';
    this.version = 0;
  }

  update(backlog: Partial<Backlog>) {
    Object.assign(this, backlog);
    this.status = 'UPDATED';
    emitter.emit('backlog:update', this);
  }

  static delete(backlog: Backlog) {
    backlog.status = 'DELETED';
    emitter.emit('backlog:delete', backlog);
  }

  static create(backlog: Backlog) {
    backlog.status = 'CREATED';
    emitter.emit('backlog:create', backlog);
  }
}
