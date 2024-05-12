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
    rowMap: new Map<ID, Set<Node>>(),
    colMap: new Map<ID, Set<Node>>(),
    coordinateMap: new Map<string, Node>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: false,
    createTime: projectCreateTime,
    offset: { x: 0, y: 0 }
  }
}

function createNodeTemplate(): Node {
  return {
    id: v4(),
    name: faker.string.sample({ min: 20, max: 30 }),
    x: faker.number.int({ min: 0, max: 10 }),
    y: faker.number.int({ min: 0, max: 5 }),
    height: faker.number.int({ min: 1, max: 3 }),
    width: faker.number.int({ min: 1, max: 5 }),
    detail: faker.string.sample({ min: 2, max: 20 }),
    record: faker.string.sample({ min: 2, max: 20 }),
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
  node.projectId = project.id
  project.nodeMap.set(node.id, node)
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

export function addEdge(project: Project, node1: Node, node2: Node) {
  const edge = {
    id: v4(),
    source: node1.id,
    target: node2.id
  }
  project.edgeMap.set(edge.id, edge)
}

export function currentProject(): Project {
  const settings = useSettings()
  const { projectMap } = useState()
  return projectMap.get(settings.active) ?? createProjectTemplate()
}