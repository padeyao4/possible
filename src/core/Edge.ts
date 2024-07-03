import type { ID } from '@/core/types';
import { v4 } from 'uuid';

export class Edge {
  id: ID;
  source: ID;
  target: ID;

  constructor(source?: ID, target?: ID, id?: ID) {
    this.id = id ?? v4();
    this.source = source ?? '';
    this.target = target ?? '';
  }

  plainObject() {
    return {
      id: this.id,
      source: this.source,
      target: this.target
    };
  }

  fromPlainObject(edge: any) {
    return Object.assign(this, edge);
  }
}
