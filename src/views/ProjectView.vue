<script setup lang="ts">
import ProjectFooter from '@/components/project/TheFooter.vue';
import { computed, provide } from 'vue';
import { useProjects } from '@/stores/project';
import type { ID } from '@/core/types';
import CanvasRuler from '@/components/project/CanvasRuler.vue';
import CanvasHeader from '@/components/project/CanvasHeader.vue';
import TheCanvas from '@/components/project/TheCanvas.vue';
import { useLayout } from '@/stores';

const { id } = defineProps<{ id: ID }>();
const layout = useLayout();
layout.showRight = false;

const projects = useProjects();
const project = computed(() => projects.getProject(id));

provide('project', project);

const titleWidth = computed(() => {
  return layout.showRight ? 10 : 145;
});
</script>

<template>
  <div class="flex h-screen flex-col border-l border-r">
    <header
      class="drag-region flex h-16 shrink-0 items-end justify-start px-3 pb-3 text-xl text-gray-500"
    >
      <div class="truncate" :style="{ width: `calc( 100% - ${titleWidth}px)` }">
        {{ project.name ?? '未命名' }}
      </div>
    </header>
    <main
      class="relative grid grow border-t border-gray-200"
      style="
        grid-template-columns: 40px calc(100% - 40px);
        grid-template-rows: 40px calc(100vh - 153px) 48px;
        background-color: #f2f4f7;
      "
    >
      <div class="flex h-full w-full items-center justify-center border-b border-r border-dashed">
        <span class="icon-[uil--unlock] text-base text-gray-500" />
      </div>
      <canvas-header />
      <canvas-ruler />
      <the-canvas />
      <project-footer class="col-span-2" style="background-color: #fff" />
    </main>
  </div>
</template>
