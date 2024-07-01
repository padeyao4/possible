import type { DraggableType } from '@/components/types';
import { v4 } from 'uuid';
import type { Backlog as BacklogType } from '@/openapi';

export class Backlog implements DraggableType {
  title: string;
  orderIndex: number;
  createdAt: Date;
  completeAt: Date | null;
  done: boolean;
  id: string;
  dbId: number | null;
  sync: boolean; // 是否同步已同步服务器
  delete: boolean; // 是否删除

  constructor(
    title: string,
    orderIndex: number,
    createdAt: Date,
    completeAt: Date | null,
    done: boolean
  ) {
    this.title = title;
    this.orderIndex = orderIndex;
    this.createdAt = createdAt;
    this.completeAt = completeAt;
    this.done = done;
    this.id = v4();
    this.dbId = null;
    this.sync = false;
    this.delete = false;
  }

  public static create(title: string) {
    const now = new Date();
    return new Backlog(title, now.getTime(), now, null, false);
  }

  public static default() {
    const now = new Date();
    return new Backlog('', now.getTime(), now, null, false);
  }

  public static from(other: BacklogType) {
    const entity = this.default();
    entity.title = other.title;
    entity.id = other.uid;
    entity.done = other.done;
    entity.dbId = other.id;
    entity.createdAt = new Date(other.createdAt);
    entity.completeAt = other.completeAt ? new Date(other.completeAt) : null;
    entity.orderIndex = other.orderIndex;
    return entity;
  }

  public toParam() {
    return {
      title: this.title,
      orderIndex: this.orderIndex,
      createdAt: this.createdAt.toISOString(),
      completeAt: this.completeAt ? this.completeAt.toISOString() : null,
      done: this.done,
      id: this.dbId,
      uid: this.id
    };
  }
}
