import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getIndexByDate } from '@/stores/timer';
import { Project } from '@/core';
import { useProjectStore } from '@/stores/project';

// 用于显示当前未完成的todo数量
export const useCounter = defineStore('counter', () => {
  const count = ref(0);
  const projects = useProjectStore();

  function countTodos() {
    const nodes = Array.from(projects.mapper.values())
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

  function $reset() {}

  return {
    count,
    countTodos,
    $reset
  };
});
