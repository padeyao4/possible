import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import type { ID } from '@/core/types';

export default class Node {
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
    this.sortedIndex = -1;
    this.projectId = null;
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
      projectId: ''
    };
    return Object.assign(new Node(), template);
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
}
