<script setup lang="ts">
import { useProjectStore, useSide } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { RouterView } from 'vue-router';
import { Plus, Setting } from '@element-plus/icons-vue';
import SideItem from '@/components/SideItem.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { Project } from '@/core';
import { handleNewProject } from '@/service/project.service';
import NavTodayItem from '@/components/NavTodayItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import WarningDialog from '@/components/WarningDialog.vue';

// todo 当调整边框时 侧边栏跟随改变
const side = useSide();

const handlePointerDown = (e: PointerEvent) => side.onPointerDown(e.clientX);

useEventListener(['pointerup', 'pointermove'], (e: PointerEvent) => {
  if (e.type === 'pointerup') {
    side.onPointerUp();
  } else {
    side.onPointerMove(e.clientX);
  }
});

const projects = useProjectStore();

const swapProjects = (from: Project, to: Project) => {
  [from.sortIndex, to.sortIndex] = [to.sortIndex, from.sortIndex];
};
</script>

<template>
  <div class="grid h-screen w-screen" :style="{ gridTemplateColumns: `${side.width}px 1fr` }">
    <div class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-300 pb-1">
        <nav-today-item />
        <nav-backlog-item />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <e-draggable :update="swapProjects" :list="projects.sortProjects" handle="data-move">
          <template #default="{ item }">
            <side-item :project="item" class="px-1.5" />
          </template>
        </e-draggable>
        <warning-dialog />
      </el-scrollbar>
      <footer class="flex h-12 shrink-0 items-center border-t border-t-gray-200 p-1">
        <div
          class="flex h-full grow flex-row items-center rounded-md border-gray-200 hover:bg-blue-100"
          @click="handleNewProject"
        >
          <el-icon class="mx-1.5" :size="26"><Plus /></el-icon>
          <el-text>新建项目</el-text>
        </div>
        <div
          class="ml-1 flex h-full w-10 items-center justify-center rounded-md border border-gray-200"
          @click="$router.push({ name: 'settings' })"
        >
          <el-icon :size="26"><Setting /></el-icon>
        </div>
      </footer>
    </div>
    <router-view
      :key="$route.fullPath"
      class="flex-grow overflow-hidden rounded-tl-lg border border-gray-300"
    />
  </div>
  <hr
    class="fixed top-0 z-40 block h-screen w-1 cursor-ew-resize"
    @pointerdown="handlePointerDown"
    :style="{ left: `${side.width}px` }"
  />
</template>
