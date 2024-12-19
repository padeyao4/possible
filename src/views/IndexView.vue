<script lang="ts" setup>
import CreateProjectButton from '@/components/CreateProjectButton.vue';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import DeleteProjectDialog from '@/components/DeleteProjectDialog.vue';
import DetailEditor from '@/components/DetailEditor.vue';
import MenuItem from '@/components/MenuItem.vue';
import NavTestItem from '@/components/NavTestItem.vue';
import RenameProjectDialog from '@/components/RenameProjectDialog.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import MenuResizer from '@/components/common/MenuResizer.vue';
import MenuToggleButton from '@/components/common/MenuToggleButton.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import NavTodayItem from '@/components/NavTodayItem.vue';
import { useAccountStore, useLayoutStore, usePlanStore, type Plan } from '@/stores';
import { RouterView } from 'vue-router';
const layoutStore = useLayoutStore();

const planStore = usePlanStore();
const accountStore = useAccountStore();

accountStore.fetchAccount();
planStore.fetchPlans();

planStore.$subscribe(() => {
  const debounceTimer = setTimeout(() => {
    planStore.savePlans();
  }, 3000);
  return () => clearTimeout(debounceTimer);
});


function onUpdate(p1: Plan, p2: Plan) {
  [p1.index, p2.index] = [p2.index, p1.index];
}

const isDev = import.meta.env.MODE !== 'production';

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
