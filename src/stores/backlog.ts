import { defineStore } from 'pinia';
import { computed, reactive } from 'vue';
import type { ID } from '@/core';
import { Backlog } from '@/core';

export const useBacklogs = defineStore('backlog', () => {
  const backlogs = reactive<Map<ID, Backlog>>(new Map());

  function $reset() {
    backlogs.clear();
  }

  function toPlainObject() {
    return Array.from(backlogs.values()).map((b) => b.toPlainObject());
  }

  function fromPlainObject(objs: any[]) {
    objs.forEach((obj) => {
      const entity = Backlog.fromPlainObject(obj);
      backlogs.set(entity.id, entity);
    });
  }

  function add(title: string) {
    const entity = new Backlog();
    entity.title = title;
    backlogs.set(entity.id, entity);
    Backlog.create(entity);
  }

  function remove(id: ID) {
    const backlog = backlogs.get(id);
    Backlog.delete(backlog);
  }

  const list = computed(() => {
    return Array.from(backlogs.values())
      .filter((b) => b.status !== 'DELETED')
      .sort((a, b) => a.orderIndex - b.orderIndex);
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
    fromPlainObject,
    get,
    toPlainObject,
    $reset
  };
});
