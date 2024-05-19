import { defineStore } from 'pinia'
import { v4 } from 'uuid'
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

  function bfsTraverseOutEdge(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId]
    const visited = new Set<ID>()
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!)
        visited.add(nodeId)
        project.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target)
        })
      }
    }
  }

  function bfsTraverseInEdge(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId]
    const visited = new Set<ID>()
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!)
        visited.add(nodeId)
        project.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source)
        })
      }
    }
  }

  function bfsTraverseNode(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId]
    const visited = new Set<ID>()
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!)
        visited.add(nodeId)
        project.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target)
        })
        project.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source)
        })
      }
    }
  }

  function addProject(project: Project): void {
    projectMap.value.set(project.id, project)
  }

  function removeProject(projectId: ID): void {
    projectMap.value.delete(projectId)
  }

  function addNode(project: Project, node: Node): void {
    const { nodeMap, inMap, outMap } = project
    node.projectId = project.id
    nodeMap.set(node.id, node)
    inMap.set(node.id, new Set<Edge>())
    outMap.set(node.id, new Set<Edge>())
  }

  function removeNode(project: Project, nodeId: ID): void {
    const { edgeMap, inMap, outMap, nodeMap } = project

    outMap.get(nodeId)?.forEach((edge) => {
      inMap.get(edge.target)?.delete(edge)
      edgeMap.delete(edge.id)
    })

    inMap.get(nodeId)?.forEach((edge) => {
      outMap.get(edge.source)?.delete(edge)
      edgeMap.delete(edge.id)
    })

    outMap.delete(nodeId)
    inMap.delete(nodeId)

    nodeMap.delete(nodeId)
  }

  function addEdge(project: Project, node1: Partial<Node>, node2: Partial<Node>): void {
    const { edgeMap, inMap, outMap } = project
    const edge = {
      id: v4(),
      source: node1.id,
      target: node2.id
    }
    edgeMap.set(edge.id, edge)
    inMap.get(edge.target).add(edge)
    outMap.get(edge.source).add(edge)
  }

  function removeEdge(project: Project, edgeId: ID): void {
    const { edgeMap, inMap, outMap } = project
    const edge = edgeMap.get(edgeId)
    const sourceNodeId = edge.source
    const targetNodeId = edge.target
    inMap.get(targetNodeId).delete(edge)
    outMap.get(sourceNodeId).delete(edge)
    edgeMap.delete(edgeId)
  }

  return {
    projectMap,
    bfsTraverseOutEdge,
    bfsTraverseInEdge,
    bfsTraverseNode,
    addProject,
    removeProject,
    addNode,
    removeNode,
    addEdge,
    removeEdge
  }
})