<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeUnmount, onMounted } from 'vue';
import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';
import { useScheduler, useUpdateDate } from '@/service';

const account = useAccount();
const projectStore = useProjectStore();
useScheduler();
useUpdateDate();

onMounted(() => {
  const debounceDataPushFnc = useDebounceFn(() => {
    console.info('data push', new Date());
    projectStore.push();
  }, 1000);

  emitter.on(BusEvents['account:login:success'], async () => {
    console.info('account login success and start to fetch user info');
    await account.fetchUser();
    emitter.emit(BusEvents['project:fetch']);
  });
  emitter.on(BusEvents['project:fetch'], () => {
    if (account.enable) {
      projectStore.fetch();
    }
  });
  emitter.on(BusEvents['project:load'], () => {
    projectStore.load();
  });
  emitter.on(BusEvents['project:push'], () => {
    if (account.enable) debounceDataPushFnc();
  });
  emitter.on(BusEvents['project:daily:update'], () => {
    console.info('daily update');
    projectStore.dailyUpdate();
  });
  emitter.on('*', (event: any) => {
    if (dataChangeEvents.has(event) && account.enable) {
      debounceDataPushFnc();
    }
  });

  // 账号如果是登录的
  if (account.enable) {
    account.fetchUser().then(() => emitter.emit(BusEvents['project:fetch']));
  }
  // 更新项目
  emitter.emit(BusEvents['project:daily:update']);
  emitter.emit(BusEvents['project:push']);
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
