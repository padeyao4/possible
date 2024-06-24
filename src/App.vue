<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeMount, onBeforeUnmount } from 'vue';
import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';
import { useCounter } from '@/stores/counter';

const account = useAccount();
const projectStore = useProjectStore();
const counter = useCounter();
useScheduler();
useUpdateDate();

onBeforeMount(() => {
  const debounceDataPushFnc = useDebounceFn(() => {
    console.info('data push', new Date());
    projectStore.push();
  }, 1000);

  emitter.on(BusEvents['login:success'], async () => {
    console.info('login success');
    await account.fetchUser();
    console.info('start to fetch project');
    emitter.emit(BusEvents['project:fetch']);
  });
  emitter.on(BusEvents['project:fetch'], async () => {
    if (account.enable) {
      await projectStore.fetch();
    }
    projectStore.dailyUpdate();
    counter.countTodos();
  });
  emitter.on(BusEvents['time:updated'], () => {
    console.info('daily update');
    projectStore.dailyUpdate();
    emitter.emit(BusEvents['project:updated']);
  });
  emitter.on('*', (event: any) => {
    if (dataChangeEvents.has(event)) {
      console.info('data change', event);
      counter.countTodos();
      if (account.enable) {
        debounceDataPushFnc();
      }
      counter.countTodos();
    }
  });

  // 账号如果是登录的
  if (account.enable) {
    account.fetchUser().then(() => emitter.emit(BusEvents['project:fetch']));
  }
});

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <router-view :key="$route.fullPath" />
  <github-corner />
</template>

<style scoped></style>
