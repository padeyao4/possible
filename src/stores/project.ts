import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { getIndexByDate } from './timer';
import { Node, Project } from '@/core';
import type { ID } from '@/core/types';
import { StorageControllerApi } from '@/openapi';
import { emitter } from '@/utils';

export const useProjectStore = defineStore('projects', () => {
  const mapper = reactive<Map<ID, Project>>(new Map());
  const dataVersion = ref(0);

  const sortProjects = computed(() => {
    return Array.from(mapper.values()).sort((p1, p2) => p1.sortIndex - p2.sortIndex) as Project[];
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

  function addProject(project: Project): void {
    // todo emitter
    mapper.set(project.id, project);
  }

  function removeProject(projectId: ID): void {
    mapper.delete(projectId);
  }

  function deserialize(data: any[]): void {
    data.forEach((obj) => {
      addProject(Project.fromPlainObject(obj));
    });
  }

  function serialize() {
    return Array.from(mapper).map(([_, value]) => value.plainObject());
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
      emitter.emit('notify:error', e);
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
      emitter.emit('notify:success', 'project load success');
    } catch (e) {
      emitter.emit('notify:error', e);
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
      emitter.emit('notify:error', e);
    } finally {
      loading.value = false;
    }
  }

  function dailyUpdate() {
    Array.from(mapper.values()).forEach((project) => {
      project.dailyUpdate();
    });
  }

  /**
   * @param projectId
   */
  function getProject(projectId: ID) {
    return mapper.get(projectId) ?? new Project();
  }

  function $reset() {
    mapper.clear();
    dataVersion.value = 0;
  }

  return {
    mapper,
    todoList,
    completedList,
    sortProjects,
    addProject,
    removeProject,
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
    getProject,
    $reset
  };
});
