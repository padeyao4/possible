import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { getIndexByDate } from './timer';
import Project from '@/core/Project';
import Node from '@/core/Node';
import type { ID } from '@/core/types';
import Edge from '@/core/Edge';
import { StorageControllerApi } from '@/openapi';
import emitter, { BusEvents } from '@/utils/emitter';

export const useProjectStore = defineStore('projects', () => {
  const mapper = reactive<Map<ID, Project>>(new Map());
  const dataVersion = ref(0);

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
      .flat()
      .sort((a, b) => {
        return a.sortedIndex - b.sortedIndex;
      });
  });

  const todoList = computed(() => {
    return nodes.value.filter((node) => node.completed === false);
  });

  const completedList = computed(() => {
    return nodes.value.filter((node) => node.completed === true);
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
    data.forEach((obj) => {
      addProject(Project.fromPlainObject(obj));
    });
  }

  function serialize() {
    return Array.from(mapper).map(([_, value]) => value.plainObject());
  }

  function getProjectById(projectId: ID) {
    return mapper.get(projectId);
  }

  const fetchLoading = ref(false);
  async function fetch() {
    try {
      fetchLoading.value = true;
      const response = await new StorageControllerApi().fetch();
      const data = response.data.payload;
      deserialize(JSON.parse(data.content));
      dataVersion.value = data.id;
    } catch (e) {
      emitter.emit(BusEvents['error:message'], e);
    } finally {
      fetchLoading.value = false;
    }
  }

  const pushLoading = ref(false);
  async function push() {
    try {
      pushLoading.value = true;
      const response = await new StorageControllerApi().push({
        dataVersion: dataVersion.value,
        content: JSON.stringify(serialize()),
        uploadAt: new Date().toJSON()
      });
      dataVersion.value = response.data.payload;
      emitter.emit(BusEvents['project:push:success']);
    } catch (e) {
      emitter.emit(BusEvents['project:push:failed'], e);
    } finally {
      pushLoading.value = false;
    }
  }

  /**
   * 加载本地localStorage数据
   */
  const loading = ref(false);
  async function load() {
    try {
      loading.value = true;
      const data = localStorage.getItem('data');
      if (data) {
        deserialize(JSON.parse(data));
      }
    } catch (e) {
      emitter.emit(BusEvents['error:message'], e);
    } finally {
      loading.value = false;
    }
  }

  function dailyUpdate() {
    Array.from(mapper.values()).forEach((project) => {
      project.dailyUpdate();
    });
  }

  function getProject(projectId: ID) {
    return mapper.get(projectId) ?? new Project();
  }

  return {
    mapper,
    todoList,
    completedList,
    sortProjects,
    getProjectById,
    addProject,
    removeProject,
    addNode,
    removeNode,
    addEdge,
    removeEdge,
    deserialize,
    faker,
    fetch,
    fetchLoading,
    loading,
    load,
    dataVersion,
    pushLoading,
    push,
    dailyUpdate,
    getProject
  };
});
