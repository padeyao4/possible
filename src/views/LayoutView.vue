<script setup lang="ts">
import { useProjectStore, useSide } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { RouterView } from 'vue-router';
import { Notebook, Plus, Setting, Sunny } from '@element-plus/icons-vue';
import SideItem from '@/components/SideItem.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { Project } from '@/core';

const side = useSide();

const handlePointerDown = (e: PointerEvent) => {
  side.onPointerDown(e.clientX);
};

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
  <div
    class="relative grid h-screen w-screen"
    :style="{ gridTemplateColumns: `${side.width}px 1fr` }"
  >
    <div class="flex h-screen w-full flex-col">
      <div class="mt-4 flex h-fit flex-col border-b border-b-gray-300 p-1">
        <div
          @click="$router.push({ name: 'today' })"
          class="flex h-12 flex-row items-center rounded-md border"
        >
          <el-icon class="mx-1.5" :size="24"><Sunny /></el-icon>
          <el-text class="grow">我的一天</el-text>
          <div class="mx-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <el-text>8</el-text>
          </div>
        </div>
        <div
          @click="$router.push({ name: 'backlog' })"
          class="flex h-12 flex-row items-center rounded-md border"
        >
          <el-icon class="mx-1.5" :size="24"><Notebook /></el-icon>
          <el-text class="grow">备忘录</el-text>
          <div class="mx-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <el-text>8</el-text>
          </div>
        </div>
      </div>
      <div class="flex-grow p-1">
        <e-draggable :update="swapProjects" :list="projects.sortProjects" handle="data-move">
          <template #default="{ item }">
            <side-item :project="item" />
          </template>
        </e-draggable>
      </div>
      <div class="flex h-12 items-center border-t border-t-gray-200 p-1">
        <div class="flex h-full grow flex-row items-center rounded-md border border-gray-200">
          <el-icon class="mx-1.5" :size="26"><Plus /></el-icon>
          <el-text>新建项目</el-text>
        </div>
        <div
          class="ml-1 flex h-full w-10 items-center justify-center rounded-md border border-gray-200"
        >
          <el-icon :size="26"><Setting /></el-icon>
        </div>
      </div>
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
