<script setup lang="ts">
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeUnmount } from 'vue';
import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';
import { useCounter } from '@/stores/counter';

const account = useAccount();
const store = useProjectStore();
const counter = useCounter();
useScheduler();
useUpdateDate();

const debounceDataPushFnc = useDebounceFn(() => {
  console.info('data push', new Date());
  store.push();
}, 1000);

emitter.on(BusEvents['login:success'], async () => {
  console.info('login success');
  await account.fetchUser();
  console.info('start to fetch project');
  emitter.emit(BusEvents['project:fetch']);
});
emitter.on(BusEvents['project:fetch'], async () => {
  if (account.enable) {
    console.info('start to fetch project');
    await store.fetch();
  }
  console.info('start daily update');
  store.dailyUpdate();
  console.info('start count todos');
  counter.countTodos();
});
emitter.on(BusEvents['time:updated'], () => {
  console.info('daily update');
  store.dailyUpdate();
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
  console.info('start to fetch user');
  account.fetchUser().then(() => emitter.emit(BusEvents['project:fetch']));
}

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <div class="title-bar"></div>
  <router-view :key="$route.fullPath" class="container" />
</template>

<style scoped>
.title-bar {
  width: 100%;
  height: 35px;
  background-color: var(--background-bottom-color);
  user-select: none;
  -webkit-app-region: drag;
}

.container {
  height: calc(100vh - 35px);
}
</style>
