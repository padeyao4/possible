import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import type { ID } from '@/core/types';
import { BacklogControllerApi } from '@/openapi';
import { Backlog } from '@/core';

export const useBacklog = defineStore('backlog', () => {
  const backlogs = reactive<Map<ID, Backlog>>(new Map());

  const backlogController = new BacklogControllerApi();

  const reloadLoading = ref(false);

  async function reload() {
    try {
      reloadLoading.value = true;
      const response = await backlogController.list();
      const items = response.data.payload;
      items.forEach((backlog) => {
        const entity = Backlog.from(backlog);
        backlogs.set(entity.id, entity);
      });
    } finally {
      reloadLoading.value = false;
    }
  }

  function $reset() {
    backlogs.clear();
  }

  function add(title: string) {
    const entity = Backlog.default();
    entity.title = title;
    entity.sync = false;
    backlogs.set(entity.id, entity);
    backlogController
      .add(entity.toParam())
      .then((response) => response.data)
      .then((data) => data.payload)
      .then((backlog) => {
        const item = backlogs.get(backlog.uid);
        item.dbId = backlog.id;
        item.sync = true;
      });
  }

  function remove(uid: ID) {
    const entity = backlogs.get(uid);
    entity.delete = true;
    entity.sync = false;
    backlogController
      ._delete(entity.dbId)
      .then((response) => response.data)
      .then((data) => data.payload)
      .then(() => {
        entity.sync = true;
        backlogs.delete(uid);
      });
  }

  const list = computed(() => {
    return Array.from(backlogs.values())
      .filter((b) => !b.delete)
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

  function done(uid: string) {
    const entity = backlogs.get(uid);
    entity.done = true;
    entity.sync = false;
    backlogController
      .update(entity.toParam())
      .then((response) => response.data)
      .then((data) => data.payload)
      .then(() => {
        entity.sync = true;
      });
  }

  function get(uid: ID) {
    return backlogs.get(uid) ?? Backlog.default();
  }

  return {
    backlogs,
    add,
    remove,
    todos,
    completes,
    todosCount,
    completesCount,
    reload,
    get,
    done,
    $reset
  };
});
