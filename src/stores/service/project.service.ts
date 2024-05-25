import { isCross } from '@/lib/math'
import { useProjects, type Edge, type ID, type Node, type Project } from '@/stores/projects'
import { useSettings } from '@/stores/settings'
import { faker } from '@faker-js/faker'
import { v4 } from 'uuid'
import { calculateDaysBetweenDates, useTimer } from '../timer'

export function createProjectTemplate(): Project {
  const { projectMap } = useProjects()
  return {
    id: v4(),
    name: 'New Project',
    nodeMap: new Map<ID, Node>(),
    edgeMap: new Map<ID, Edge>(),
    inMap: new Map<ID, Set<Edge>>(),
    outMap: new Map<ID, Set<Edge>>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: false,
    createTime: Date.now().valueOf(),
    offset: { x: 0, y: 0 }
  }
}

export function createNodeTemplate(): Node {
  return {
    id: v4(),
    name: 'New Task',
    x: 1,
    y: 1,
    height: 1,
    width: 1,
    detail: '',
    record: '',
    completed: false,
    sortedIndex: -1,
    projectId: -1
  }
}

export function createRandomNodeTemplate(): Node {
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

/**
 * 判断是不是右边相邻的节点
 */
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

/**
 * 图中获取右边相邻的节点
 */
export function getRightNodes(project: Project, node: Node): Node[] {
  const { outMap, nodeMap } = project
  const set = outMap.get(node.id)
  return Array.from(set)
    .map((edge) => nodeMap.get(edge.target))
    .filter((n) => n.x - node.x === node.width)
}

/**
 * 图中获取左边相邻的节点
 */
export function getLeftNodes(project: Project, node: Node): Node[] {
  const { inMap, nodeMap } = project
  const set = inMap.get(node.id)
  return Array.from(set)
    .map((edge) => nodeMap.get(edge.source))
    .filter((n) => node.x - n.x === n.width)
}

/**
 * dag图在当前节点和其右侧节点向右移动
 */
export function moveRight(project: Project, node: Node) {
  const rightNodes = getRightNodes(project, node)
  rightNodes.forEach((rightNode) => {
    moveRight(project, rightNode)
  })
  node.x += 1
  getCollideNodes(project, node).forEach((collideNode) => {
    while (isCross(node, collideNode)) {
      moveDown(project, collideNode)
    }
  })
}

/**
 * dag图在当前节点和其左侧节点向左移动
 */
export function moveLeft(project: Project, node: Node) {
  const leftNodes = getLeftNodes(project, node)
  leftNodes.forEach((leftNode) => {
    moveLeft(project, leftNode)
  })
  node.x -= 1
  getCollideNodes(project, node).forEach((collideNode) => {
    while (isCross(node, collideNode)) {
      moveDown(project, collideNode)
    }
  })
}

function syncProjectByIndex(project: Project, index: number) {
  const { nodeMap } = project
  const nodes = Array.from(nodeMap.values())

  let tempNodes = nodes.filter((n) => n.x + n.width <= index && n.completed === false)
  while (tempNodes.length > 0) {
    tempNodes.forEach((node) => moveRight(project, node))
    tempNodes = nodes.filter((n) => n.x + n.width <= index)
  }
}

export function syncProjects() {
  const projects = useProjects()
  const timer = useTimer()
  for (const iterator of projects.projectMap.values()) {
    const index = calculateDaysBetweenDates(timer.timestamp, iterator.createTime)
    syncProjectByIndex(iterator, index)
  }
}

export function tryMoveUpWhole(project: Project, node: Node) {
  if (node.y <= 0) {
    return
  }
  node.y -= 1
  getCollideNodes(project, node).forEach((collideNode) => {
    tryMoveUpWhole(project, collideNode)
  })
  if (getCollideNodes(project, node).length !== 0) {
    node.y += 1
  }
}

export function tryMoveDownWhole(project: Project, node: Node) {
  node.y += 1
  getCollideNodes(project, node).forEach((collideNode) => {
    tryMoveDownWhole(project, collideNode)
  })
}

export function appendNode(project: Project, node: Node) {
  moveRight(project, node)
  node.x -= 1
  const newNode = createNodeTemplate()
  newNode.x = node.x + 1
  newNode.y = node.y
  useProjects().addNode(project, newNode)
  const { outMap } = project
  const projects = useProjects()
  outMap.get(node.id).forEach((edge) => {
    projects.addEdge(project, { id: newNode.id }, { id: edge.target })
    projects.removeEdge(project, edge.id)
  })
  projects.addEdge(project, { id: node.id }, { id: newNode.id })
}