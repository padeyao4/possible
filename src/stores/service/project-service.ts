import { type Edge, type Node, type Project, useState } from '@/stores/state'
import { v4 } from 'uuid'
import type { ID } from '@antv/g6'
import { faker } from '@faker-js/faker'
import { useSettings } from '@/stores/settings'
import { isCross } from '@/lib/math'

export function createProjectTemplate(): Project {
  const projectCreateTime = faker.date.between({ from: '1900/1/1', to: '2024/3/20' }).valueOf()
  const { projectMap } = useState()
  return {
    id: v4(),
    name: faker.person.fullName(),
    nodeMap: new Map<ID, Node>(),
    edgeMap: new Map<ID, Edge>(),
    inMap: new Map<ID, Set<Edge>>(),
    outMap: new Map<ID, Set<Edge>>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: false,
    createTime: projectCreateTime,
    offset: { x: 0, y: 0 }
  }
}

export function createNodeTemplate(): Node {
  return {
    id: v4(),
    name: faker.lorem.words({ min: 5, max: 20 }),
    x: faker.number.int({ min: 0, max: 10 }),
    y: faker.number.int({ min: 0, max: 5 }),
    height: faker.number.int({ min: 1, max: 3 }),
    width: faker.number.int({ min: 1, max: 5 }),
    detail: faker.lorem.paragraphs(2),
    record: faker.lorem.paragraphs(3),
    completed: false,
    sortedIndex: -1,
    projectId: -1
  }
}

export function addProject(project: Project) {
  const { projectMap } = useState()
  projectMap.set(project.id, project)
}

export function addNode(project: Project, node: Node) {
  const { nodeMap, inMap, outMap } = project
  node.projectId = project.id
  nodeMap.set(node.id, node)
  inMap.set(node.id, new Set<Edge>())
  outMap.set(node.id, new Set<Edge>())
}


export function deleteNodeById(project: Project, nodeId: ID) {
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

export function addEdge(project: Project, node1: Node, node2: Node) {
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

export function currentProject(): Project {
  const settings = useSettings()
  const { projectMap } = useState()
  return projectMap.get(settings.active) ?? createProjectTemplate()
}

export function testProjects() {
  for (let i = 0; i < 10; i++) {
    const project = createProjectTemplate()
    const node1 = createNodeTemplate()
    const node2 = createNodeTemplate()
    if (!isCross(node1, node2) && node1.x + node1.width < node2.x) {
      addNode(project, node1)
      addNode(project, node2)
      addProject(project)
      addEdge(project, node1, node2)
    }
  }
}
