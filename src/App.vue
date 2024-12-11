<script lang="ts" setup>
import { RouterView } from 'vue-router';
import { useAccountStore, useBacklogStore, useDataStore } from '@/stores';
import { useDebounceFn, useWindowSize } from '@vueuse/core';
import { watchEffect } from 'vue';
import router from '@/router';
import { BacklogControllerApi, DataStoreControllerApi } from '@/openapi';

const dataStore = useDataStore();
const accountStore = useAccountStore();
const { width, height } = useWindowSize();
const backlogStore = useBacklogStore();

backlogStore.fetch();

const debounceBacklogsFn = useDebounceFn((mutation, state) => {
  if (!state.loading) {
    new BacklogControllerApi().add1(Array.from(state.backlogsMap.values()));
  }
}, 1000);

backlogStore.$subscribe(debounceBacklogsFn);

dataStore.fetch();
const debounceDataFn = useDebounceFn((mutation, state) => {
  if (!state.loading) {
    new DataStoreControllerApi().add({
      projects: Array.from(state.projectsMap.values()),
      nodes: Array.from(state.nodesMap.values()),
      edges: Array.from(state.edgesMap.values())
    });
  }
}, 1000);
dataStore.$subscribe(debounceDataFn);

watchEffect(() => {
  dataStore.viewWidth = width.value;
  dataStore.viewHeight = height.value;
});

watchEffect(() => {
  // 没有token时跳转到登录页面
  if (!accountStore.token) {
    setTimeout(() => {
      router.push({ name: 'login' });
    });
  }
});
</script>

<template>
  <router-view />
</template>
