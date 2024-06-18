import { defineStore } from 'pinia';
import { computed, reactive, toRaw } from 'vue';
import { useRoute } from './route';
import { useSettings } from './settings';
import { getDaysBetweenDates, getIndexByDate } from './timer';
import Project from '@/core/Project';
import Node from '@/core/Node';
import type { ID } from '@/core/types';
import Edge from '@/core/Edge';

export const useProjectStore = defineStore('projects', () => {
  const mapper = reactive<Map<ID, Project>>(new Map());

  const sortProjects = computed(() => {
    return Array.from(mapper.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex);
  });

  const nodes = computed<Node[]>(() => {
    return Array.from(mapper.values())
      .map((project) => {
        const curX = getIndexByDate(<Project>project);
        const { nodeMap } = project;
        return Array.from(nodeMap.values()).filter((node) => {
          return node.x <= curX && curX < node.x + node.width;
        });
      })
      .flat();
  });

  const todoList = computed(() => {
    return nodes.value
      .filter((node) => node.completed === false)
      .sort((a, b) => {
        return a.sortedIndex - b.sortedIndex;
      });
  });

  const completedList = computed(() => {
    return nodes.value
      .filter((node) => node.completed === true)
      .sort((a, b) => a.sortedIndex - b.sortedIndex);
  });

  function faker() {
    mapper.clear();
    for (let i = 0; i < 10; i++) {
      const project = Project.faker();
      for (let j = 0; j < 10; j++) {
        project.addNode(Node.faker());
      }
      mapper.set(project.id, project);
    }
  }

  function bfsTraverseOutEdge(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        project.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target);
        });
      }
    }
  }

  function bfsTraverseInEdge(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        project.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source);
        });
      }
    }
  }

  function bfsTraverseNode(project: Project, nodeId: ID, callback: (node: Node) => void): void {
    const queue = [nodeId];
    const visited = new Set<ID>();
    while (queue.length > 0) {
      const nodeId = queue.shift() as ID;
      if (!visited.has(nodeId)) {
        callback(project.nodeMap.get(nodeId)!);
        visited.add(nodeId);
        project.outMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.target);
        });
        project.inMap.get(nodeId)?.forEach((edge: Edge) => {
          queue.push(edge.source);
        });
      }
    }
  }

  function addProject(project: Project): void {
    mapper.set(project.id, project);
  }

  function removeProject(projectId: ID): void {
    mapper.delete(projectId);
  }

  function addNode(project: Project, node: Node): void {
    const { nodeMap, inMap, outMap } = project;
    node.projectId = project.id;
    nodeMap.set(node.id, node);
    inMap.set(node.id, new Set<Edge>());
    outMap.set(node.id, new Set<Edge>());
  }

  function removeNode(project: Project, nodeId: ID): void {
    const { edgeMap, inMap, outMap, nodeMap } = project;

    outMap.get(nodeId)?.forEach((edge) => {
      inMap.get(edge.target)?.delete(edge);
      edgeMap.delete(edge.id);
    });

    inMap.get(nodeId)?.forEach((edge) => {
      outMap.get(edge.source)?.delete(edge);
      edgeMap.delete(edge.id);
    });

    outMap.delete(nodeId);
    inMap.delete(nodeId);

    nodeMap.delete(nodeId);
  }

  function setOffsetByDate(project: Project, date: Date | string | number) {
    const settings = useSettings();
    project.offset.x = getDaysBetweenDates(project.createTime, new Date(date)) * settings.unitWidth;
  }

  function addEdge(project: Project, node1: Partial<Node>, node2: Partial<Node>, id?: ID): void {
    const { edgeMap, inMap, outMap } = project;
    const edge = new Edge(node1.id, node2.id, id);
    edgeMap.set(edge.id, edge);
    inMap.get(edge.target).add(edge);
    outMap.get(edge.source).add(edge);
  }

  function removeEdge(project: Project, edgeId: ID): void {
    const { edgeMap, inMap, outMap } = project;
    const edge = edgeMap.get(edgeId);
    const sourceNodeId = edge.source;
    const targetNodeId = edge.target;
    inMap.get(targetNodeId).delete(edge);
    outMap.get(sourceNodeId).delete(edge);
    edgeMap.delete(edgeId);
  }

  function deserialize(data: any[]): void {
    if (!Array.isArray(data)) return;
    data.forEach((obj) => {
      const project = Project.fromPlainObject(obj);
      addProject(project);
    });
  }

  function serialize() {
    return Array.from(mapper).map(([key, value]) => value.plainObject());
  }

  function getCurrentProject() {
    const { active } = useRoute();
    return mapper.get(active.param) ?? new Project();
  }

  function getProjectById(projectId: ID) {
    return mapper.get(projectId);
  }

  return {
    // projectMap: mapper,
    todoList,
    completedList,
    sortProjects,
    getProjectById,
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
    setOffsetByDate,
    getCurrentProject,
    faker
  };
});
