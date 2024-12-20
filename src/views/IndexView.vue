<script lang="ts" setup>
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import MenuResizer from '@/components/common/MenuResizer.vue';
import MenuToggleButton from '@/components/common/MenuToggleButton.vue';
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
import { useLayoutStore, usePlanStore, type Plan } from '@/stores';
import { useDebounceFn } from '@vueuse/core';
import { RouterView } from 'vue-router';
const layoutStore = useLayoutStore();

const planStore = usePlanStore();
setTimeout(async () => {
  await planStore.fetchPlans();
  planStore.updatePlans();
});

const debounceSavePlans = useDebounceFn(() => {
  planStore.savePlans();
}, 1500);
planStore.$subscribe(debounceSavePlans);


function onUpdate(p1: Plan, p2: Plan) {
  [p1.index, p2.index] = [p2.index, p1.index];
}

const isDev = import.meta.env.MODE !== 'production';


// 设置每天晚上12点执行计划更新
function setupMidnightUpdate() {
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // 计算到明天0点的毫秒数
  const timeToMidnight = tomorrow.getTime() - now.getTime();

  // 设置首次执行的定时器
  setTimeout(() => {
    // 执行更新
    planStore.updatePlans();

    // 设置每24小时执行一次的定时器
    setInterval(() => {
      planStore.updatePlans();
    }, 24 * 60 * 60 * 1000);

  }, timeToMidnight);
}

// 启动定时更新
setupMidnightUpdate();



</script>

<template>
  <div :style="layoutStore.gridTemplateColumns" class="grid h-screen w-screen">
    <div v-if="layoutStore.menuVisible" class="flex h-screen w-full flex-col">
      <header class="mt-2 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <menu-toggle-button class="mx-2 ml-auto" />
        <nav-today-item />
        <nav-backlog-item />
        <nav-test-item v-if="isDev" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <magic-draggable :update="onUpdate" :list="planStore.projects">
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
    <menu-resizer />
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
