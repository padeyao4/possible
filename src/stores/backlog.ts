import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { ID } from '@/core/types';
import { Backlog } from '@/core';

export const useBacklogs = defineStore('backlog', () => {
  const backlogs = reactive<Map<ID, Backlog>>(new Map());

  function $reset() {
    backlogs.clear();
  }

  function add(title: string) {
    const entity = new Backlog();
    entity.title = title;
    backlogs.set(entity.id, entity);
  }

  function remove(id: ID) {
    const backlog = backlogs.get(id);
    backlog.syncStatus = 'DELETED';
    backlog.push();
  }

  const list = computed(() => {
    return Array.from(backlogs.values())
      .filter((b) => b.syncStatus !== 'DELETED')
      .sort((a, b) => a.orderIndex - b.orderIndex);
  });

  const todos = computed(() => {
    console.log('todos update');
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

  function get(id: ID) {
    return backlogs.get(id);
  }

  return {
    backlogs,
    add,
    remove,
    todos,
    completes,
    todosCount,
    completesCount,
    get,
    $reset
  };
});
