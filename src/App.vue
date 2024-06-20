<script setup lang="ts">
import GithubCorner from '@/components/other/GithubCorner.vue';
import emitter, { BusEvents, dataChangeEvents } from '@/utils/emitter';
import { onBeforeUnmount, onMounted } from 'vue';
import { useAccount } from '@/stores/account';
import { useProjectStore } from '@/stores/project';
import { useDebounceFn } from '@vueuse/core';

const account = useAccount();
const projectStore = useProjectStore();

const debounceDataPushFnc = useDebounceFn(() => {
  projectStore.push();
  console.info('data push', new Date());
}, 1000);

onMounted(() => {
  emitter.on(BusEvents['account:login:success'], async () => {
    await account.fetchUser();
    emitter.emit(BusEvents['project:fetch']);
  });
  emitter.on(BusEvents['project:fetch'], () => {
    if (account.enableSync) {
      projectStore.fetch();
    }
  });
  emitter.on(BusEvents['project:load'], () => projectStore.load());
  emitter.on(BusEvents['project:push'], () => {
    if (account.enableSync) projectStore.push();
  });
  emitter.on('*', (event: any) => {
    if (dataChangeEvents.has(event) && account.enableSync) {
      debounceDataPushFnc();
    }
  });

  // 账号如果是登录的
  if (account.online) {
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
