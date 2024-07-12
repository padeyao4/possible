import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import type { ID } from '@/core/types';
import type { SyncStatus } from '@/core/sync';
import { emitter } from '@/utils';

export class Node {
  id: ID;
  name: string;
  x: number;
  y: number;
  height: number;
  width: number;
  detail: string;
  record: string;
  completed: boolean;
  sortedIndex: number;
  projectId: ID;

  sid: number;
  version: number;
  status: SyncStatus;

  constructor() {
    this.id = v4();
    this.name = 'New Task';
    this.x = 1;
    this.y = 1;
    this.height = 1;
    this.width = 1;
    this.detail = '';
    this.record = '';
    this.completed = false;
    this.sortedIndex = new Date().getTime();
    this.projectId = null;
    this.sid = null;
    this.version = 0;
    this.status = 'CREATED';
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      height: this.height,
      width: this.width,
      detail: this.detail,
      record: this.record,
      completed: this.completed,
      sortedIndex: this.sortedIndex,
      projectId: this.projectId,
      sid: this.sid,
      version: this.version,
      status: this.status
    };
  }
  public static fromPlainObject(obj: any) {
    const node = new Node();
    node.id = obj.id;
    node.name = obj.name;
    node.x = obj.x;
    node.y = obj.y;
    node.height = obj.height;
    node.width = obj.width;
    node.detail = obj.detail;
    node.record = obj.record;
    node.completed = obj.completed;
    node.sortedIndex = obj.sortedIndex;
    node.projectId = obj.projectId;
    node.sid = obj.sid;
    node.version = obj.version;
    node.status = obj.status;
    return node;
  }

  public static faker(): Node {
    const template = {
      id: v4(),
      name: faker.lorem.words({ min: 5, max: 20 }),
      x: faker.number.int({ min: 0, max: 100 }),
      y: faker.number.int({ min: 0, max: 100 }),
      height: faker.number.int({ min: 1, max: 5 }),
      width: faker.number.int({ min: 1, max: 10 }),
      detail: faker.lorem.paragraphs({ min: 1, max: 5 }),
      record: faker.lorem.paragraphs({ min: 2, max: 10 }),
      completed: false,
      sortedIndex: -1,
      projectId: '',
      sid: null,
      version: 0,
      status: 'CREATED'
    };
    return Node.fromPlainObject(template);
  }

  /**
   * 判断两个节点是否重叠
   * @param node
   */
  public cross(node: Node): boolean {
    const { x: x1, y: y1, width: w1, height: h1 } = node;
    const { x: x2, y: y2, width: w2, height: h2 } = this;
    return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
  }

  /**
   * 向上移动
   */
  public moveUp(step = 1) {
    this.y -= step;
  }

  /**移动到底部 */
  public moveDown(step = 1) {
    this.y += step;
  }

  /**移动到左边 */
  public moveLeft(step = 1) {
    this.x -= step;
  }

  /**移动到右边 */
  public moveRight(step = 1) {
    this.x += step;
  }

  update(node: Partial<Node>) {
    Object.assign(this, node);
    this.status = 'UPDATED';
    emitter.emit('node:update', this);
  }
}
