import type { ID, Point } from './types';
import { markRaw } from 'vue';
import Node from './Node';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import Edge from '@/core/Edge';

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

  public plainObject() {
    return {
      id: this.id,
      name: this.name,
      nodeMap: Array.from(this.nodeMap.values()).map((n) => n.plainObject()),
      edgeMap: Array.from(this.edgeMap.values()).map((e) => e.plainObject()),
      completed: this.completed,
      sortIndex: this.sortIndex,
      editable: this.editable,
      createTime: this.createTime,
      offset: this.offset
    };
  }

  public static fromPlainObject(obj: any) {
    const project = new Project();

    project.id = obj.id;
    project.name = obj.name;
    project.completed = obj.completed;
    project.sortIndex = obj.sortIndex;
    project.editable = obj.editable;
    project.createTime = obj.createTime;
    project.offset = obj.offset;

    obj.nodeMap.forEach((node: any) => {
      project.add(Node.fromPlainObject(node));
    });

    obj.edgeMap.forEach((edge: any) => {
      project.addEdge(edge.source, edge.target, edge.id);
    });
    return project;
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
    return Array.from(this.nodeMap.values()).filter((n) => n.id !== node.id && n.cross(node));
  }

  /**
   * 获取node左侧关系节点
   * @param item
   */
  public getRelationLeftNodes(item: Node | ID) {
    const nodeId = typeof item === 'string' ? item : item.id;
    return Array.from(this.inMap.get(nodeId)).map((edge) => this.nodeMap.get(edge.target));
  }

  /**
   * 获取node右侧关系节点
   * @param item
   */
  public getRelationRightNodes(item: Node | ID) {
    const nodeId = typeof item === 'string' ? item : item.id;
    return Array.from(this.inMap.get(nodeId)).map((edge) => this.nodeMap.get(edge.source));
  }

  public addEdge(source: Node | ID, target: Node | ID, id?: ID) {
    const sourceId = typeof source === 'string' ? source : source.id;
    const targetId = typeof target === 'string' ? target : target.id;
    const edge = new Edge(sourceId, targetId, id);
    this.edgeMap.set(edge.id, edge);
    this.inMap.get(edge.target).add(edge);
    this.outMap.get(edge.source).add(edge);
    return edge;
  }

  /**
   * 删除一个节点，包括和该节点相关的所有边
   * @param nodeId
   */
  public removeNode(nodeId: ID) {
    const { inMap, outMap, edgeMap, nodeMap } = this;

    outMap.get(nodeId)?.forEach((edge) => {
      inMap.get(edge.target)?.delete(edge);
      edgeMap.delete(edge.id);
    });

    inMap.get(nodeId)?.forEach((edge) => {
      outMap.get(edge.source)?.delete(edge);
      edgeMap.delete(edge.id);
    });

    outMap.delete(nodeId);
    inMap.delete(nodeId);

    nodeMap.delete(nodeId);
  }

  /**
   * 删除节点相关的所有边
   * @param nodeId
   */
  public removeRelations(nodeId: ID) {
    const { inMap, outMap } = this;

    outMap.get(nodeId)?.forEach((edge) => {
      inMap.get(edge.target)?.delete(edge);
    });

    inMap.get(nodeId)?.forEach((edge) => {
      outMap.get(edge.source)?.delete(edge);
    });

    outMap.delete(nodeId);
    inMap.delete(nodeId);
  }
}
