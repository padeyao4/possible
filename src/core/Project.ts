import type { ID, Point } from './types';
import { markRaw, toRaw } from 'vue';
import Node from './Node';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import Edge from '@/core/Edge';
import { getDaysBetweenDates, useTimer } from '@/stores/timer';
import { useSettings } from '@/stores/settings';
import type { DraggableType } from '@/components/types';

export default class Project implements DraggableType {
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
      project.addNode(Node.fromPlainObject(node));
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

  public addNode(node: Node) {
    if (this.nodeMap.has(node.id)) return;
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
    return Array.from(this.inMap.get(nodeId)).map((edge) => this.nodeMap.get(edge.source));
  }

  /**
   * 获取node右侧关系节点
   * @param item
   */
  public getRelationRightNodes(item: Node | ID) {
    const nodeId = typeof item === 'string' ? item : item.id;
    return Array.from(this.outMap.get(nodeId)).map((edge) => this.nodeMap.get(edge.target));
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

  public getEdge(source: ID, target: ID) {
    const { inMap } = this;
    return Array.from(inMap.get(target)).find((edge) => edge.source === source);
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

  public removeEdge(item: Edge | ID) {
    const edge = typeof item === 'string' ? this.edgeMap.get(item) : item;
    const { edgeMap, inMap, outMap } = this;
    const sourceNodeId = edge.source;
    const targetNodeId = edge.target;

    inMap.get(targetNodeId).delete(toRaw(edge));
    outMap.get(sourceNodeId).delete(toRaw(edge));
    edgeMap.delete(edge.id);
  }

  public removeLeftRelations(nodeId: ID) {
    Array.from(this.inMap.get(nodeId)).forEach((edge) => {
      this.removeEdge(edge);
    });
  }

  public removeRightRelations(nodeId: ID) {
    Array.from(this.outMap.get(nodeId)).forEach((edge) => {
      this.removeEdge(edge);
    });
  }

  /**
   * 删除节点相关的所有边
   * @param nodeId
   */
  public removeRelations(nodeId: ID) {
    this.removeLeftRelations(nodeId);
    this.removeRightRelations(nodeId);
  }

  public getNode(id: ID) {
    return this.nodeMap.get(id);
  }

  /**
   * 根据偏移量获取画布上的点，此偏移量是只鼠标事件在画布上点的坐标。
   * @param point 在逻辑上离画布原点的距离
   */
  public getPointByOffsetPoint(point: Point) {
    return {
      x: point.x - this.offset.x,
      y: point.y - this.offset.y
    };
  }

  /**
   * 检查节点在graph关系中 是否正确顺序.
   * 例如 a->b-c 的图, b节点位置不能超过c,也不能小于a
   * @param node
   */
  public correctOrderOfNode(node: Node) {
    const { inMap, outMap, nodeMap } = this;
    const leftAvailable = Array.from(inMap.get(node.id)).every((edge) => {
      const source = nodeMap.get(edge.source);
      return source.x + source.width <= node.x;
    });
    const rightAvailable = Array.from(outMap.get(node.id)).every((edge) => {
      const target = nodeMap.get(edge.target);
      return node.x + node.width <= target.x;
    });
    return leftAvailable && rightAvailable;
  }

  private getRightNeighborNodes(node: Node) {
    return Array.from(this.outMap.get(node.id)).map((edge) => this.nodeMap.get(edge.target));
  }

  private getLeftNeighborNodes(node: Node) {
    return Array.from(this.inMap.get(node.id)).map((edge) => this.nodeMap.get(edge.source));
  }

  private moveNodeDownToNextSpace(node: Node) {
    node.moveDown();
    while (this.collides(node).length !== 0) {
      node.moveDown();
    }
  }

  private moveRightWithRelationNode(node: Node) {
    const rightNodes = this.getRightNeighborNodes(node).filter(
      (rightNode) => rightNode.x - node.x === node.width
    );
    rightNodes.forEach((rightNode) => {
      this.moveRightWithRelationNode(rightNode);
    });
    node.moveRight();
    this.collides(node).forEach((collideNode) => {
      while (node.cross(collideNode)) {
        this.moveNodeDownToNextSpace(collideNode);
      }
    });
  }

  /**
   * 每日更新
   */
  public dailyUpdate() {
    const deltaIndex = getDaysBetweenDates(useTimer().timestamp, this.createTime);
    let nodes = Array.from(this.nodeMap.values());
    do {
      nodes = nodes
        .filter((node) => !node.completed)
        .filter((node) => node.x + node.width <= deltaIndex);
      nodes.forEach((node) => {
        this.moveRightWithRelationNode(node);
      });
    } while (nodes.length > 0);
  }

  /**
   * 根据日期修改offset x
   * @param date
   */
  public setOffsetIndex(date: any) {
    this.offset.x = getDaysBetweenDates(this.createTime, date) * useSettings().unitWidth;
  }
}
