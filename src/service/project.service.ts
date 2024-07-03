import { isCross } from '@/graph/math';
import { useProjectStore } from '@/stores/project';
import { Node } from '@/core/Node';
import { Project } from '@/core/Project';
import router from '@/router';
import emitter, { BusEvents } from '@/utils/emitter';

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
  node.moveRight();
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

export function appendNode(project: Project, node: Node) {
  moveRight(project, node);
  node.moveLeft();
  const newNode = new Node();
  newNode.x = node.x + 1;
  newNode.y = node.y;
  project.addNode(newNode);
  const { outMap } = project;
  outMap.get(node.id).forEach((edge) => {
    project.addEdge(newNode.id, edge.target);
    project.removeEdge(edge.id);
  });
  project.addEdge(node.id, newNode.id);
}

export function tryMoveDownWhole(project: Project, node: Node) {
  node.y += 1;
  project.collides(node).forEach((collideNode) => {
    tryMoveDownWhole(project, collideNode);
  });
}

/**
 * 创建项目按钮
 */
export async function handleNewProject() {
  const project = new Project();
  project.editable = true;
  useProjectStore().addProject(project);
  setTimeout(async () => {
    await router.push({ name: 'project', query: { id: project.id } });
    emitter.emit(BusEvents['project:created']);
  });
}
