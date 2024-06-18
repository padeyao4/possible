import { isCross } from '@/lib/math';
import { useProjectStore } from '@/stores/project';
import { useRoute } from '@/stores/route';
import { getDaysBetweenDates, useTimer } from '@/stores/timer';
import Node from '@/core/Node';
import Project from '@/core/Project';

export function currentProject() {
  return useProjectStore().getCurrentProject();
}

export function moveDown(project: Project, node: Node) {
  node.y += 1;
  while (project.collides(node).length !== 0) {
    node.y += 1;
  }
}

export function tryMoveUp(project: Project, node: Node) {
  if (node.y <= 0) {
    return;
  }
  node.y -= 1;
  while (project.collides(node).length !== 0 && node.y > 0) {
    node.y -= 1;
  }
  while (project.collides(node).length !== 0) {
    node.y += 1;
  }
}

/**
 * 图中获取右边相邻的节点
 */
export function getRightNodes(project: Project, node: Node): Node[] {
  const { outMap, nodeMap } = project;
  const set = outMap.get(node.id);
  return Array.from(set)
    .map((edge) => nodeMap.get(edge.target))
    .filter((n) => n.x - node.x === node.width);
}

/**
 * 图中获取左边相邻的节点
 */
export function getLeftNodes(project: Project, node: Node): Node[] {
  const { inMap, nodeMap } = project;
  const set = inMap.get(node.id);
  return Array.from(set)
    .map((edge) => nodeMap.get(edge.source))
    .filter((n) => node.x - n.x === n.width);
}

/**
 * dag图在当前节点和其右侧节点向右移动
 */
export function moveRight(project: Project, node: Node) {
  const rightNodes = getRightNodes(project, node);
  rightNodes.forEach((rightNode) => {
    moveRight(project, rightNode);
  });
  node.x += 1;
  project.collides(node).forEach((collideNode) => {
    while (isCross(node, collideNode)) {
      moveDown(project, collideNode);
    }
  });
}

/**
 * dag图在当前节点和其左侧节点向左移动
 */
export function moveLeft(project: Project, node: Node) {
  const leftNodes = getLeftNodes(project, node);
  leftNodes.forEach((leftNode) => {
    moveLeft(project, leftNode);
  });
  node.x -= 1;
  const nodes = project.collides(node);
  nodes.forEach((collideNode) => {
    while (isCross(node, collideNode)) {
      moveDown(project, collideNode);
    }
  });
}

function updateProjectByIndex(project: Project, index: number) {
  const { nodeMap } = project;
  const nodes = Array.from(nodeMap.values());

  const filterFunc = (n: Node) => n.x + n.width <= index && n.completed === false;

  let tempNodes = nodes.filter(filterFunc);
  while (tempNodes.length > 0) {
    tempNodes.forEach((node) => moveRight(project, node));
    tempNodes = nodes.filter(filterFunc);
  }
}

/**
 * 每日更新任务项目状态,
 * todo
 */
export function updateProjects() {
  const projects = useProjectStore();
  const timer = useTimer();
  for (const iterator of projects.projectMap.values()) {
    const index = getDaysBetweenDates(timer.timestamp, iterator.createTime);
    updateProjectByIndex(<Project>iterator, index);
  }
}

export function tryMoveUpWhole(project: Project, node: Node) {
  if (node.y <= 0) {
    return;
  }
  node.y -= 1;
  project.collides(node).forEach((collideNode) => {
    tryMoveUpWhole(project, collideNode);
  });
  if (project.collides(node).length !== 0) {
    node.y += 1;
  }
}

export function tryMoveDownWhole(project: Project, node: Node) {
  node.y += 1;
  project.collides(node).forEach((collideNode) => {
    tryMoveDownWhole(project, collideNode);
  });
}

export function appendNode(project: Project, node: Node) {
  moveRight(project, node);
  node.x -= 1;
  const newNode = new Node();
  newNode.x = node.x + 1;
  newNode.y = node.y;
  useProjectStore().addNode(project, newNode);
  const { outMap } = project;
  const projects = useProjectStore();
  outMap.get(node.id).forEach((edge) => {
    projects.addEdge(project, { id: newNode.id }, { id: edge.target });
    projects.removeEdge(project, edge.id);
  });
  projects.addEdge(project, { id: node.id }, { id: newNode.id });
}

/**
 * 创建项目按钮
 */
export function handleNewProject() {
  const project = new Project();
  const { linkTo } = useRoute();
  useProjectStore().addProject(project);
  setTimeout(() => {
    linkTo('project', project.id.toString()).then();
    project.editable = true;
  });
}
