<script lang="ts" setup>
import { useGraph } from '@/stores';
import { RouterView } from 'vue-router';
import NavTodayItem from '@/components/NavTodayItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import MenuItem from '@/components/MenuItem.vue';
import CreateProjectButton from '@/components/CreateProjectButton.vue';
import SettingsButton from '@/components/SettingsButton.vue';
import CreateProjectDialog from '@/components/CreateProjectDialog.vue';
import DeleteProjectDialog from '@/components/DeleteProjectDialog.vue'
const graph = useGraph();
</script>

<template>
  <div style="grid-template-columns: 240px 1fr" class="grid h-screen w-screen">
    <div class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <nav-today-item class="my-1" />
        <nav-backlog-item class="my-1" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <menu-item v-for="item in graph.projects" :project="item" />
      </el-scrollbar>
      <footer class="flex h-12 shrink-0 items-center border-t border-t-gray-200 p-1">
        <create-project-button />
        <settings-button />
      </footer>
    </div>
    <router-view :key="$route.fullPath" class="min-w-48 flex-grow rounded-tl-lg" />
  </div>
  <create-project-dialog />
  <delete-project-dialog/>
</template>
