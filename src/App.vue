<script setup lang="ts">
import { emitter } from '@/utils';
import { useAccount } from '@/stores';
import { axiosConfig } from '@/core/config';
import LoginView from '@/views/LoginView.vue';
import { RouterView } from 'vue-router';
import { onBeforeUnmount } from 'vue';
import {
  useListenAppEvent,
  useListenNotifyEvent,
  useListenProjectEvent,
  useLoadApp
} from '@/service';

axiosConfig();

useListenNotifyEvent();
useListenAppEvent();
useListenProjectEvent();

useLoadApp();

const account = useAccount();

/*const projects = useProjects();
const counter = useCounter();
useScheduler();
useUpdateDate();*/

// const debounceDataPushFnc = useDebounceFn(() => {
//   console.info('data push', new Date());
//   store.push();
// }, 1000);

/*
emitter.on('date:update', () => {
  projects.dailyUpdate();
});
*/

// emitter.on('*', (event: any) => {
//   // 数据变化
//   if (dataChangeEvents.has(event)) {
//     counter.countTodos();
//     if (account.isRemote) debounceDataPushFnc();
//   }
// });

// 账号如果是登录的
// if (account.isAuth) {
//   account.fetchUser().then(() => emitter.emit('login:success'));
// }

onBeforeUnmount(() => {
  emitter.all.clear();
});
</script>

<template>
  <router-view v-if="account.isAuth" />
  <login-view v-else />
</template>
