<script lang="ts" setup>
import { type Project, useGraph } from '@/stores';
import { RouterView } from 'vue-router';
import NavTodayItem from '@/components/NavTodayItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import MenuItem from '@/components/MenuItem.vue';
import CreateProjectButton from '@/components/CreateProjectButton.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import DeleteProjectDialog from '@/components/DeleteProjectDialog.vue';
import DetailEditor from '@/components/DetailEditor.vue';
import RenameProjectDialog from '@/components/RenameProjectDialog.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
const graph = useGraph();

function handleUpdate(p1: Project, p2: Project) {
  [p1.index, p2.index] = [p2.index, p1.index];
}
</script>

<template>
  <div :style="graph.gridTemplateColumns" class="grid h-screen w-screen">
    <div class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <nav-today-item class="my-1" />
        <nav-backlog-item class="my-1" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <magic-draggable :update="handleUpdate" :list="graph.sortedProjects">
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
    <router-view :key="$route.fullPath" class="min-w-48 flex-grow rounded-tl-lg" />
    <detail-editor />
  </div>
  <create-project-dialog />
  <delete-project-dialog />
  <rename-project-dialog />
</template>
