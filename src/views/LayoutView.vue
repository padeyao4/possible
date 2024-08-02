<script setup lang="ts">
import { useProjects, useLayout } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { RouterView } from 'vue-router';
import SideItem from '@/components/SideItem.vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import { Project } from '@/core';
import { handleNewProject } from '@/service/common';
import NavTodayItem from '@/components/NavTodayItem.vue';
import NavBacklogItem from '@/components/NavBacklogItem.vue';
import WarningDialog from '@/components/WarningDialog.vue';
import DetailEditor from '@/components/DetailEditor.vue';

const layout = useLayout();

const leftSideDown = (e: PointerEvent) => layout.leftPointerDown(e.clientX);

const rightSideDown = (e: PointerEvent) => layout.rightPointerDown(e.clientX);

useEventListener(['pointerup', 'pointermove'], (e: PointerEvent) => {
  if (e.type === 'pointerup') {
    layout.onPointerUp();
  } else {
    layout.onPointerMove(e.clientX);
  }
});

const projects = useProjects();

const swapProjects = (from: Project, to: Project) => {
  [from.sortIndex, to.sortIndex] = [to.sortIndex, from.sortIndex];
};
</script>

<template>
  <div
    class="grid h-screen w-screen"
    :style="{ gridTemplateColumns: layout.gridTemplateColumnsStyle }"
  >
    <div v-if="layout.showLeft" class="flex h-screen w-full flex-col">
      <header class="mt-4 flex h-fit flex-col border-b border-b-gray-200 pb-1">
        <nav-today-item class="my-1" />
        <nav-backlog-item class="my-1" />
      </header>
      <el-scrollbar class="flex-grow px-2.5 py-1.5">
        <e-draggable :update="swapProjects" :list="projects.sortProjects" handle="data-move">
          <template #default="{ item }">
            <side-item :project="item" class="my-1 px-1.5" />
          </template>
        </e-draggable>
        <warning-dialog />
      </el-scrollbar>
      <footer class="flex h-12 shrink-0 items-center border-t border-t-gray-200 p-1">
        <div
          class="flex h-full grow flex-row items-center rounded-md border-gray-200 hover:bg-blue-50"
          @click="handleNewProject"
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
    <hr
      v-if="layout.showLeft"
      class="fixed top-0 z-40 block h-screen w-1 cursor-ew-resize"
      @pointerdown="leftSideDown"
      :style="{ left: `${layout.leftWidth}px` }"
    />
    <router-view :key="$route.fullPath" class="min-w-48 flex-grow rounded-tl-lg" />
    <hr
      v-if="layout.showRight"
      class="fixed top-0 z-40 block h-screen w-1 cursor-ew-resize"
      @pointerdown="rightSideDown"
      :style="{ right: `${layout.rightWidth - 4}px` }"
    />
    <detail-editor />
  </div>
</template>
