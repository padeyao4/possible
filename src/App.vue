<script setup lang="ts">
import emitter, { dataChangeEvents } from '@/utils/emitter';
import { useAccount, useBacklogs, useProjectStore } from '@/stores';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';
import { useCounter } from '@/stores/counter';
import SystemTitlebar from '@/components/SystemTitlebar.vue';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
import { onBeforeUnmount } from 'vue';

axiosConfig();

const account = useAccount();
const store = useProjectStore();
const counter = useCounter();
const backlog = useBacklogs();
useScheduler();
useUpdateDate();

const debounceDataPushFnc = useDebounceFn(() => {
  console.info('data push', new Date());
  store.push();
}, 1000);

emitter.on('login:success', async () => {
  await account.fetchUser();
  await store.fetch();
  await backlog.reload();
  store.dailyUpdate();
  counter.countTodos();
});

emitter.on('date:update', () => {
  store.dailyUpdate();
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
  account.fetchUser().then(() => emitter.emit('login:success'));
}

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <!--  <system-titlebar />-->
  <router-view v-if="account.isAuth" />
  <login-view v-else />
</template>
