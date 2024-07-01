<script setup lang="ts">
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeUnmount } from 'vue';
import { useAccount } from '@/stores';
import { useProjectStore } from '@/stores';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';
import { useCounter } from '@/stores/counter';
import SystemTitlebar from '@/components/SystemTitlebar.vue';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { useBacklog } from '@/stores';

axiosConfig();

const account = useAccount();
const store = useProjectStore();
const counter = useCounter();
const backlog = useBacklog();
useScheduler();
useUpdateDate();

const debounceDataPushFnc = useDebounceFn(() => {
  console.info('data push', new Date());
  store.push();
}, 1000);

emitter.on(BusEvents['app:reload'], async () => {
  await account.fetchUser();
  await store.fetch();
  await backlog.reload();
  store.dailyUpdate();
  counter.countTodos();
});

emitter.on(BusEvents['login:success'], async () => {
  emitter.emit(BusEvents['app:reload']);
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
  account.fetchUser().then(() => emitter.emit(BusEvents['app:reload']));
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
