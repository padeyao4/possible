<script setup lang="ts">
import CanvasPaths from '@/components/ProjectViewComponent/CanvasPaths.vue';
import CanvasCards from '@/components/ProjectViewComponent/CanvasCards.vue';
import { computed, onMounted, ref } from 'vue';
import { Register } from '@/graph/base';
import CanvasTempPaths from '@/components/ProjectViewComponent/CanvasTempPaths.vue';
import { useCanvas } from '@/stores/canvas';
import DragCanvas from '@/graph/behavior/drag-canvas';
import { DragCard } from '@/graph/behavior/drag-card';
import { ResizeCard } from '@/graph/behavior/resize-card';
import { DefaultBehavior } from '@/graph/behavior/default';
import { DoubleClickCard } from '@/graph/behavior/double-click-card';
import { CreateEdge } from '@/graph/behavior/create-edge';
import { HandleContextmenu } from '@/graph/behavior/handle-contextmenu';
import WheelCanvas from '@/graph/behavior/wheel-canvas';
import { useProjectStore } from '@/stores/project';

const svg = ref();
const canvas = useCanvas();
const projectStore = useProjectStore();
const project = projectStore.getCurrentProject();

onMounted(() => {
  canvas.set(svg.value);
  const register = new Register(svg.value, project);
  register.addBehaviors(
    DefaultBehavior,
    DragCanvas,
    DragCard,
    ResizeCard,
    DoubleClickCard,
    CreateEdge,
    HandleContextmenu,
    WheelCanvas
  );
  register.listen();
});

const translateX = computed(() => project?.offset.x);
const translateY = computed(() => project?.offset.y);
</script>

<template>
  <svg ref="svg" @contextmenu.prevent data-el-type="canvas" data-type="canvas">
    <g :transform="`translate(${translateX},${translateY})`">
      <canvas-paths></canvas-paths>
      <canvas-cards></canvas-cards>
      <canvas-temp-paths></canvas-temp-paths>
    </g>
  </svg>
</template>

<style scoped>
svg {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  margin-top: 40px;
  margin-left: 40px;
  background-color: var(--background-canvas-color);
}
</style>
