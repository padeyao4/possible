<script setup lang="ts">
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue';
import { computed, provide, ref } from 'vue';
import { useProjectStore } from '@/stores/project';
import type { ID } from '@/core/types';
import ProjectEditor from '@/components/ProjectEditor.vue';
import CanvasRuler from '@/components/ProjectViewComponent/CanvasRuler.vue';
import CanvasHeader from '@/components/ProjectViewComponent/CanvasHeader.vue';
import GraphContextmenu from '@/components/ProjectViewComponent/GraphContextmenuGroup.vue';
import TheCanvas from '@/components/ProjectViewComponent/TheCanvas.vue';
import CanvasGrid from '@/components/ProjectViewComponent/CanvasGrid.vue';
import { Icon } from '@iconify/vue';
import { Lock } from '@element-plus/icons-vue';

const { id } = defineProps<{ id: ID }>();

const projects = useProjectStore();
const project = computed(() => projects.getProject(id));

const canvasContainer = ref();

provide('canvasContainer', canvasContainer);
provide('project', project);
</script>

<template>
  <div class="flex h-screen w-full flex-row">
    <div class="flex grow flex-col">
      <header
        class="drag-region flex h-16 shrink-0 items-end justify-start px-3 pb-3 text-xl text-gray-500"
      >
        {{ project.name ?? '未命名' }}
      </header>
      <main
        class="relative grid grow border-t border-gray-200"
        style="
          grid-template-columns: 40px calc(100% - 40px);
          grid-template-rows: 40px calc(100vh - 153px) 48px;
        "
        ref="canvasContainer"
      >
        <div
          class="flex h-full w-full items-center justify-center place-self-center border-b border-r border-dashed"
        >
          <span class="icon-[uil--unlock] text-base text-gray-500" />
        </div>
        <canvas-header />
        <canvas-ruler />
        <the-canvas />
        <project-footer class="col-span-2 border-t border-gray-200 bg-transparent" />
        <GraphContextmenu />
      </main>
    </div>
    <project-editor />
  </div>
</template>
