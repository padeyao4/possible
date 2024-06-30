import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import { Backlog } from '@/core';
import type { ID } from '@/core/types';

export const useBacklog = defineStore('backlog', () => {
  const backlogs = reactive<Map<ID, Backlog>>(new Map());

  function $reset() {
    backlogs.clear();
  }

  function add(title: string) {
    const now = new Date();
    const backlog = new Backlog(title, now.getTime(), now);
    backlogs.set(backlog.id, backlog);
  }

  function remove(id: ID) {
    backlogs.delete(id);
  }

  const list = computed(() => {
    return Array.from(backlogs.values()).sort((a, b) => a.orderIndex - b.orderIndex);
  });

  const todos = computed(() => {
    return list.value.filter((b) => !b.done);
  });

  const completes = computed(() => {
    return list.value.filter((b) => b.done);
  });

  const todosCount = computed(() => {
    return todos.value.length;
  });

  const completesCount = computed(() => {
    return completes.value.length;
  });

  return {
    backlogs,
    add,
    remove,
    todos,
    completes,
    todosCount,
    completesCount,
    $reset
  };
});
