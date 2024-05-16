import { isCross } from '@/lib/math'
import { useProjects, type Edge, type ID, type Node, type Project } from '@/stores/projects'
import { useSettings } from '@/stores/settings'
import { faker } from '@faker-js/faker'
import { v4 } from 'uuid'

export function createProjectTemplate(): Project {
  const { projectMap } = useProjects()
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
    createTime: faker.date.between({ from: '1900/1/1', to: new Date() }).valueOf(),
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

export function currentProject(): Project {
  const settings = useSettings()
  const { projectMap } = useProjects()
  return projectMap.get(settings.active) ?? createProjectTemplate()
}

export function testProjects() {
  const projects = useProjects()
  for (let i = 0; i < 10; i++) {
    const project = createProjectTemplate()
    const node1 = createNodeTemplate()
    const node2 = createNodeTemplate()
    if (!isCross(node1, node2) && node1.x + node1.width < node2.x) {
      projects.addNode(project, node1)
      projects.addNode(project, node2)
      projects.addProject(project)
      projects.addEdge(project, node1, node2)
    }
  }
}

/**
 * 判断节点是否和其他节点相交
 * @param project project
 * @param node node
 * @returns boolean
 */
export function collideNodes(project: Project, node: Node) {
  const { nodeMap } = project
  const nodes = Array.from(nodeMap.values())
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === node.id) continue
    if (isCross(node, nodes[i])) {
      return true
    }
  }
  return false
}

export function getCollideNodes(project: Project, node: Node): Node[] {
  const { nodeMap } = project
  const nodes = Array.from(nodeMap.values())
  const collideNodes: Node[] = []
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].id === node.id) continue
    if (isCross(node, nodes[i])) {
      collideNodes.push(nodes[i])
    }
  }
  return collideNodes
}

export function isRightNode(project: Project, node: Node, node2: Node): boolean {
  const { outMap } = project
  const set = outMap.get(node.id)
  const edges = Array.from(set).map((edge) => edge.target)
  return new Set(edges).has(node2.id)
}

export function moveDown(project: Project, node: Node) {
  node.y += 1
  while (collideNodes(project, node)) {
    node.y += 1
  }
}

export function tryMoveUp(project: Project, node: Node) {
  if (node.y <= 0) {
    return
  }
  node.y -= 1
  while (collideNodes(project, node) && node.y > 0) {
    node.y -= 1
  }
}

export function moveRight(project: Project, node: Node) {
  node.x += 1
  getCollideNodes(project, node).forEach((collideNode) => {
    if (isRightNode(project, node, collideNode)) {
      while (isCross(node, collideNode)) {
        moveRight(project, collideNode)
      }
    } else {
      while (isCross(node, collideNode)) {
        moveDown(project, collideNode)
      }
    }
  })
}