<script lang="ts" setup>
import CreateProjectButton from '@/components/CreateProjectButton.vue';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import DeleteProjectDialog from '@/components/DeleteProjectDialog.vue';
import DetailEditor from '@/components/DetailEditor.vue';
import MenuItem from '@/components/MenuItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import NavTodayItem from '@/components/NavTodayItem.vue';
import RenameProjectDialog from '@/components/RenameProjectDialog.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import { type Project } from '@/openapi';
import { useBacklogStore, useDataStore } from '@/stores';
import { useDebounceFn, useIntervalFn, useWindowSize } from '@vueuse/core';
import { onUnmounted, watchEffect } from 'vue';
import { RouterView } from 'vue-router';
import NavTestItem from '@/components/NavTestItem.vue';
const dataStore = useDataStore();

const { width, height } = useWindowSize();
const backlogStore = useBacklogStore();

backlogStore.fetch();
const debounceBacklogsFn = useDebounceFn((_mutation, state) => {
  if (!state.loading) {
    backlogStore.upload();
  }
}, 1000);
backlogStore.$subscribe(debounceBacklogsFn);

dataStore.fetch();
const debounceDataFn = useDebounceFn((_mutation, state) => {
  if (!state.loading) {
    dataStore.upload();
  }
}, 1000);
dataStore.$subscribe(debounceDataFn);

watchEffect(() => {
  dataStore.viewWidth = width.value;
  dataStore.viewHeight = height.value;
});

const { pause } = useIntervalFn(() => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    dataStore.updateNodes();
  }
  dataStore.timestamp = now.getTime();
}, 60 * 1000); // 每分钟检查一次

onUnmounted(() => {
  pause(); // 组件卸载时清除定时器
});

function handleUpdate(p1: Project, p2: Project) {
  [p1.index, p2.index] = [p2.index, p1.index];
}

const isDev = import.meta.env.MODE !== 'production';
</script>

<template>
  <div :style="dataStore.gridTemplateColumns" class="grid h-screen w-screen">
    <div class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <nav-today-item />
        <nav-backlog-item />
        <nav-test-item v-if="isDev" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <magic-draggable :update="handleUpdate" :list="dataStore.sortedProjects">
          <template #default="{ item }">
            <menu-item :project="item" />
          </template>
        </magic-draggable>
      </el-scrollbar>
      <footer class="flex h-12 shrink-0 items-center border-t border-t-gray-200 p-1">
        <create-project-button />
        <settings-button />
      </footer>
    </div>
    <router-view :key="$route.fullPath" class="min-w-48 flex-grow route-container" />
    <detail-editor />
  </div>
  <create-project-dialog />
  <delete-project-dialog />
  <rename-project-dialog />
</template>
<style scoped>
.route-container {
  border-radius: 8px 0 0 0;
}
</style>
