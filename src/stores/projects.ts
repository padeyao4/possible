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
  completed: boolean
  sortIndex: number
  editable: boolean
  createTime: number
  offset: Point
}

export type Path = { id: string, from: Point, to: Point, [key: string]: any }

export const useProjects = defineStore('projects', () => {
  const projectMap = ref<Map<ID, Project>>(new Map<ID, Project>())
  return {
    projectMap
  }
})