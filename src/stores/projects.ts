import { createProjectTemplate } from '@/service/project.service'
import { defineStore } from 'pinia'
import { v4 } from 'uuid'
import { ref } from 'vue'
import { useSettings } from './settings'
import { getDaysBetweenDates } from './timer'
import type { Edge, ID, Node, Project } from './types'

export const useProjects = defineStore('projects', () => {
  const projectMap = ref<Map<ID, Project>>(new Map<ID, Project>())

  function getProject(id: ID): Project | undefined {
    return projectMap.value.get(id)
  }

  function getProjectByNode(node: Node) {
    return getProject(node.projectId)
  }

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

  function setOffsetByDate(project: Project, date: Date | string | number) {
    const settings = useSettings()
    project.offset.x = getDaysBetweenDates(project.createTime, new Date(date)) * settings.unitWidth
  }

  function addEdge(
    project: Project,
    node1: Partial<Node>,
    node2: Partial<Node>,
    id: ID = undefined
  ): void {
    const { edgeMap, inMap, outMap } = project
    const edge = {
      id: id === undefined ? v4() : id,
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

  function deserialize(data: any[]): void {
    if (!Array.isArray(data)) return

    data.forEach((projectData) => {
      const project: Project = createProjectTemplate()
      project.id = projectData.id
      project.name = projectData.name
      project.completed = projectData.completed
      project.sortIndex = projectData.sortIndex
      project.editable = projectData.editable
      project.createTime = projectData.createTime
      project.offset = { x: 0, y: 0 }
      projectData.nodeMap.forEach((value) => {
        addNode(project, value)
      })
      projectData.edgeMap.forEach((edge: Edge) => {
        addEdge(project, { id: edge.source }, { id: edge.target }, edge.id)
      })
      addProject(project)
    })
  }

  function serialize() {
    return Array.from(projectMap.value).map(([key, value]) => ({
      id: key,
      name: value.name,
      nodeMap: Array.from(value.nodeMap.values()),
      edgeMap: Array.from(value.edgeMap.values()),
      inMap: Array.from(value.inMap).map(([k, v]) => [k, Array.from(v)]),
      outMap: Array.from(value.outMap).map(([k, v]) => [k, Array.from(v)]),
      completed: value.completed,
      sortIndex: value.sortIndex,
      editable: value.editable,
      createTime: value.createTime,
      offset: value.offset
    }))
  }

  return {
    projectMap,
    getProject,
    getProjectByNode,
    bfsTraverseOutEdge,
    bfsTraverseInEdge,
    bfsTraverseNode,
    addProject,
    removeProject,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    deserialize,
    serialize,
    setOffsetByDate
  }
})
