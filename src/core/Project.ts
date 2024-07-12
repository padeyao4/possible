import type { ID, Point } from './types';
import { markRaw, toRaw } from 'vue';
import { Node } from './Node';
import { v4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { Edge } from './Edge';
import { getDaysBetweenDates, useSettings, useTimer } from '@/stores';
import { type SyncStatus } from '@/core';

export class Project {
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

  sid: number;
  status: SyncStatus;
  version: number;

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
    this.sid = null;
    this.status = 'SYNCED';
    this.version = 0;
  }

  public toPlainObject() {
    return {
      id: this.id,
      name: this.name,
      nodes: Array.from(this.nodeMap.values()).map((n) => n.toPlainObject()),
      edges: Array.from(this.edgeMap.values()).map((e) => e.plainObject()),
      completed: this.completed,
      sortIndex: this.sortIndex,
      createTime: this.createTime,
      offset: this.offset,
      version: this.version,
      status: this.status,
      sid: this.sid
    };
  }

  public static fromPlainObject(obj: any) {
    const project = new Project();

    project.id = obj.id;
    project.name = obj.name;
    project.completed = obj.completed;
    project.sortIndex = obj.sortIndex;
    project.createTime = obj.createTime;
    project.offset = obj.offset;
    project.version = obj.version;
    project.status = obj.status;
    project.sid = obj.sid;

    obj.nodes.forEach((node: any) => project.addNode(Node.fromPlainObject(node)));
    obj.edges.forEach((edge: any) => project.addEdge(edge.source, edge.target, edge.id));
    return project;
  }

  public static faker(): Project {
    const source = {
      id: v4(),
      name: faker.lorem.words({ min: 3, max: 50 }),
      nodes: [],
      edges: [],
      completed: false,
      sortIndex: new Date().getTime(),
      editable: false,
      createTime: faker.date.between({ from: '1900-01-01', to: '2024-06-01' }).getTime(),
      offset: { x: 0, y: 0 }
    };
    return Project.fromPlainObject(source);
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
    // todo emitter
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
    // todo emitter
  }

  public removeEdge(item: Edge | ID) {
    const edge = typeof item === 'string' ? this.edgeMap.get(item) : item;
    const { edgeMap, inMap, outMap } = this;
    const sourceNodeId = edge.source;
    const targetNodeId = edge.target;

    inMap.get(targetNodeId).delete(toRaw(edge));
    outMap.get(sourceNodeId).delete(toRaw(edge));
    edgeMap.delete(edge.id);
    // todo emitter
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
    // todo emitter
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

  /**
   * 拉取右边的关联的节点,
   *
   * 右边关联节点和它做关系节点距离一格以上，则它向左移动一格
   * @param item
   */
  public pullRightNode(item: Node | ID) {
    const nodeId = typeof item === 'string' ? item : item.id;
    const { nodeMap, inMap, outMap } = this;
    const node = nodeMap.get(nodeId);
    Array.from(outMap.get(node.id))
      .map((edge) => nodeMap.get(edge.target))
      .filter((rightNode) =>
        Array.from(inMap.get(rightNode.id))
          .map((edge) => nodeMap.get(edge.source))
          .every((leftNode) => rightNode.x - leftNode.x > 1)
      )
      .forEach((rightNode) => {
        rightNode.moveLeft();
      });
  }

  public bfsOutEdge(nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(this.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        this.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target);
        });
      }
    }
  }

  public bfsInEdge(nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(this.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        this.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source);
        });
      }
    }
  }

  public bfsNode(nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(this.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        this.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target);
        });
        this.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source);
        });
      }
    }
  }
}
