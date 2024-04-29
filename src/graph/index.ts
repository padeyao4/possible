import type { Point } from '@antv/g6'

export type ID = string | number;

export interface Edge {
  id: ID
  source: ID
  target: ID
}

export interface Node {
  id: ID
  name: string
  x: number
  y: number
  detail: string
  record: string
  completed: boolean
  sortedIndex: number
  projectId: ID
  parentId: ID
}

export interface Project {
  id: ID
  name: string
  nodesMap: Map<ID, Node>
  edgesMap: Map<ID, Edge>
  inEdgesMap: Map<ID, Set<Edge>>
  outEdgesMap: Map<ID, Set<Edge>>
  rowsMap: Map<ID, Set<Node>>
  colsMap: Map<ID, Set<Node>>
  coordinateMap: Map<string, Node>
  completed: boolean
  sortIndex: number
  editable: boolean
  createTime: number
  offset: Point
}


export class Graph {
  projectMap: Map<ID, Project>
}