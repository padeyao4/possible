<script setup lang="ts">
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeUnmount } from 'vue';
import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';
import { useCounter } from '@/stores/counter';
import SystemTitlebar from '@/components/SystemTitlebar.vue';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';

axiosConfig();

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
  await account.fetchUser();
  // todo
  emitter.emit(BusEvents['project:fetch']);
});
emitter.on(BusEvents['project:fetch'], async () => {
  if (account.isLocal) return;
  await store.fetch();
  store.dailyUpdate();
  counter.countTodos();
});
emitter.on(BusEvents['time:updated'], () => {
  store.dailyUpdate();
  emitter.emit(BusEvents['project:updated']);
});
emitter.on('*', (event: any) => {
  // 数据变化
  if (dataChangeEvents.has(event)) {
    counter.countTodos();
    if (account.isRemote) debounceDataPushFnc();
  }
});

// 账号如果是登录的
if (account.isAuth) {
  console.info('start to fetch user');
  account.fetchUser().then(() => emitter.emit(BusEvents['project:fetch']));
}

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <system-titlebar />
  <router-view v-if="account.isAuth" :key="$route.fullPath" style="height: 100vh" />
  <login-view v-else />
</template>

<style scoped>
/**
 * 滚动条样式
 */
:deep(.el-scrollbar__thumb) {
  background: #000000;
}
</style>
