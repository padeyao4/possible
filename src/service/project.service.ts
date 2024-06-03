import { isCross } from '@/lib/math'
import { useProjects, type Edge, type ID, type Node, type Project } from '@/stores/projects'
import { useRoute } from '@/stores/route'
import { getDaysBetweenDates, useTimer } from '@/stores/timer'
import { faker } from '@faker-js/faker'
import { v4 } from 'uuid'

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

export function createRandomProjectTemplate(): Project {
  const { projectMap } = useProjects()
  return {
    id: v4(),
    name: faker.lorem.words({ min: 3, max: 50 }),
    nodeMap: new Map<ID, Node>(),
    edgeMap: new Map<ID, Edge>(),
    inMap: new Map<ID, Set<Edge>>(),
    outMap: new Map<ID, Set<Edge>>(),
    completed: false,
    sortIndex: Array.from(projectMap.values()).length + 1,
    editable: false,
    createTime: faker.date.between({ from: '1900-01-01', to: '2024-06-01' }).getTime(),
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
    x: faker.number.int({ min: 0, max: 100 }),
    y: faker.number.int({ min: 0, max: 100 }),
    height: faker.number.int({ min: 1, max: 5 }),
    width: faker.number.int({ min: 1, max: 10 }),
    detail: faker.lorem.paragraphs({ min: 1, max: 5 }),
    record: faker.lorem.paragraphs({ min: 2, max: 10 }),
    completed: false,
    sortedIndex: -1,
    projectId: -1
  }
}

export function currentProject(): Project {
  const { active } = useRoute()
  const { getProject } = useProjects()
  return getProject(active.param) ?? createProjectTemplate()
}

export function testProjects() {
  const { addNode, addProject } = useProjects()
  for (let i = 0; i < 20; i++) {
    const project = createRandomProjectTemplate()

    addProject(project)
    for (let j = 0; j < 1000; j++) {
      const node1 = createRandomNodeTemplate()
      addNode(project, node1)
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

function updateProjectByIndex(project: Project, index: number) {
  const { nodeMap } = project
  const nodes = Array.from(nodeMap.values())

  const filterFunc = (n: Node) => n.x + n.width <= index && n.completed === false

  let tempNodes = nodes.filter(filterFunc)
  while (tempNodes.length > 0) {
    tempNodes.forEach((node) => moveRight(project, node))
    tempNodes = nodes.filter(filterFunc)
  }
}

/**
 * 每日更新任务项目状态
 */
export function updateProjects() {
  const projects = useProjects()
  const timer = useTimer()
  for (const iterator of projects.projectMap.values()) {
    const index = getDaysBetweenDates(timer.timestamp, iterator.createTime)
    updateProjectByIndex(iterator, index)
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
