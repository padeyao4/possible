import type { ID } from './types';
import { v4 } from 'uuid';
import type { DraggableType } from '@/components/types';

export class Backlog implements DraggableType {
  title: string;
  orderIndex: number;
  createdAt: Date;
  completeAt: Date | null;
  done: boolean;
  id: ID;

  constructor(title: string, orderIndex: number, createdAt: Date, completeAt: Date = null) {
    this.title = title;
    this.orderIndex = orderIndex;
    this.createdAt = createdAt;
    this.completeAt = completeAt;
    this.done = false;
    this.id = v4();
  }
}
