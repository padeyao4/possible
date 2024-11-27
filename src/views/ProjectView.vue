<script lang="ts" setup>
import TheFooter from '@/components/project/TheFooter.vue';
import CanvasRuler from '@/components/project/CanvasRuler.vue';
import CanvasHeader from '@/components/project/CanvasHeader.vue';
import TheCanvas from '@/components/project/TheCanvas.vue';
import { useGraph } from '@/stores';

const graph = useGraph();
const project = graph.currentProject;
</script>

<template>
  <div class="flex h-screen flex-col border-l border-r">
    <header
      class="drag-region flex h-16 shrink-0 items-end justify-start px-3 pb-3 text-xl text-gray-500"
    >
      <div class="truncate">
        {{ project.name }}
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
      <the-footer />
    </main>
  </div>
</template>
