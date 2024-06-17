import type { Edge, ID, Point } from './types';
import { markRaw } from 'vue';
import Node from './Node';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';

export default class Project {
  id: ID;
  name: string;
  nodeMap: Map<ID, Node>;
  edgeMap: Map<ID, Edge>;
  inMap: Map<ID, Set<Edge>>;
  outMap: Map<ID, Set<Edge>>;
  completed: boolean;
  sortIndex: number;
  editable: boolean;
  createTime: number;
  offset: Point;

  public constructor() {
    this.id = v4();
    this.name = '';
    this.nodeMap = new Map();
    this.edgeMap = new Map();
    this.inMap = markRaw(new Map());
    this.outMap = markRaw(new Map());
    this.completed = false;
    this.sortIndex = new Date().getTime();
    this.editable = false;
    this.createTime = new Date().getTime();
    this.offset = { x: 0, y: 0 };
  }

  public static faker(): Project {
    return Object.assign(new Project(), {
      id: v4(),
      name: faker.lorem.words({ min: 3, max: 50 }),
      nodeMap: new Map<ID, Node>(),
      edgeMap: new Map<ID, Edge>(),
      inMap: new Map<ID, Set<Edge>>(),
      outMap: new Map<ID, Set<Edge>>(),
      completed: false,
      sortIndex: new Date().getTime(),
      editable: false,
      createTime: faker.date.between({ from: '1900-01-01', to: '2024-06-01' }).getTime(),
      offset: { x: 0, y: 0 }
    });
  }

  public add(node: Node) {
    node.projectId = this.id;
    this.nodeMap.set(node.id, node);
    this.inMap.set(node.id, new Set<Edge>());
    this.outMap.set(node.id, new Set<Edge>());
  }

  /**
   * 在当前项目中找到和node重叠的其他节点
   * @param node
   */
  public collides(node: Node): Node[] {
    const nodes = Array.from(this.nodeMap.values());
    const ans = [];
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].id === node.id || !node.cross(nodes[i])) continue;
      ans.push(nodes[i]);
    }
    return ans;
  }
}
