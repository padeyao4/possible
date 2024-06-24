import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getIndexByDate } from '@/stores/timer';
import Project from '@/core/Project';
import { useProjectStore } from '@/stores/project';

export const useCounter = defineStore('counter', () => {
  const count = ref(0);
  const store = useProjectStore();

  function countTodos() {
    const nodes = Array.from(store.mapper.values())
      .map((project) => {
        const curX = getIndexByDate(<Project>project);
        const { nodeMap } = project;
        return Array.from(nodeMap.values()).filter((node) => {
          return node.x <= curX && curX < node.x + node.width;
        });
      })
      .flat()
      .filter((node) => !node.completed);
    count.value = nodes.length;
  }

  return {
    count,
    countTodos
  };
});
