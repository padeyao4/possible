<script lang="ts" setup>
import CreateProjectButton from '@/components/CreateProjectButton.vue';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import DeleteProjectDialog from '@/components/DeleteProjectDialog.vue';
import DetailEditor from '@/components/DetailEditor.vue';
import MenuItem from '@/components/MenuItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import NavTestItem from '@/components/NavTestItem.vue';
import NavTodayItem from '@/components/NavTodayItem.vue';
import RenameProjectDialog from '@/components/RenameProjectDialog.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import MenuToggleButton from '@/components/common/MenuToggleButton.vue';
import { type Project } from '@/openapi';
import { useBacklogStore, useCursor, useDataStore } from '@/stores';
import { useDebounceFn, useIntervalFn } from '@vueuse/core';
import { onUnmounted, ref } from 'vue';
import { RouterView } from 'vue-router';
const dataStore = useDataStore();
const resizer = ref<HTMLElement>();
let startX = 0;
let startWidth = 0;

const cursor = useCursor();

function initDrag(e: MouseEvent) {
  startX = e.clientX;
  startWidth = dataStore.menuWidth;
  document.addEventListener('mousemove', doDrag);
  document.addEventListener('mouseup', stopDrag);
  cursor.lock('col-resize');
  document.body.style.userSelect = 'none';
}

function doDrag(e: MouseEvent) {
  const newLocal = startWidth + e.clientX - startX;
  if (newLocal <= 260) {
    dataStore.menuWidth = 260;
    dataStore.menuVisible = false;
  } else {
    dataStore.menuWidth = Math.min(460, newLocal);
    dataStore.menuVisible = true;
  }
}

function stopDrag() {
  document.removeEventListener('mousemove', doDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.userSelect = '';
  cursor.unlock();
  cursor.setWithUnlock('default');
}

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
    <div v-if="dataStore.menuVisible" class="flex h-screen w-full flex-col">
      <header class="mt-2 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <menu-toggle-button class="mx-2 ml-auto" />
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
    <div v-if="dataStore.menuVisible" ref="resizer" class="absolute inset-0 hover:cursor-col-resize" :style="{
      width: '5px',
      left: `${dataStore.menuWidth}px`,
      zIndex: 999,
      backgroundColor: 'transparent'
    }" @mousedown="initDrag" />
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
