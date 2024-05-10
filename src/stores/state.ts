import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ID = string | number

export interface Point {
  x: number,
  y: number
}

export interface Node {
  id: ID
  name: string
  x: number
  y: number
  height: number
  width: number
  detail: string
  record: string
  completed: boolean
  sortedIndex: number
  projectId: ID
}

export interface Edge {
  id: ID
  source: ID
  target: ID
}

export interface Project {
  id: ID
  name: string
  nodeMap: Map<ID, Node>
  edgeMap: Map<ID, Edge>
  inMap: Map<ID, Set<Edge>>
  outMap: Map<ID, Set<Edge>>
  rowMap: Map<ID, Set<Node>>
  colMap: Map<ID, Set<Node>>
  coordinateMap: Map<string, Node>
  completed: boolean
  sortIndex: number
  editable: boolean
  createTime: number
  offset: Point
}


export const useState = defineStore('state', () => {
  const projectMap = ref<Map<ID, Project>>(new Map<ID, Project>())
  return {
    projectMap
  }
})