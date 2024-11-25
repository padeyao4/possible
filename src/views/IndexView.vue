<script lang="ts" setup>
import { useGraph } from '@/stores';
import { RouterView } from 'vue-router';
import NavTodayItem from '@/components/NavTodayItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import MenuItem from '@/components/MenuItem.vue';

const graph = useGraph();
/**
 * 点击创建项目按钮
 */
function clickAddProjectButton() {
  // todo
  // setTimeout(() => {
  //   router.push({ name: 'project', query: { id: project.id } });
  // });
}
</script>

<template>
  <div style="grid-template-columns: 240px 1fr" class="grid h-screen w-screen">
    <div class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <nav-today-item class="my-1" />
        <nav-backlog-item class="my-1" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <menu-item v-for="item in graph.projects" :project="item" class="my-1 px-1.5" />
      </el-scrollbar>
      <footer class="flex h-12 shrink-0 items-center border-t border-t-gray-200 p-1">
        <div
          class="flex h-full grow flex-row items-center rounded-md border-gray-200 hover:bg-blue-50"
          @click="clickAddProjectButton"
        >
          <span class="icon-[uil--plus] mx-1.5 bg-gray-500 text-2xl" />
          <el-text>新建项目</el-text>
        </div>
        <div
          class="ml-1 flex h-full w-10 items-center justify-center rounded-md border border-gray-200 hover:bg-blue-50"
          @click="$router.push({ name: 'settings' })"
        >
          <span class="icon-[cil--settings] bg-gray-500 text-2xl"></span>
        </div>
      </footer>
    </div>
    <router-view :key="$route.fullPath" class="min-w-48 flex-grow rounded-tl-lg" />
  </div>
</template>
