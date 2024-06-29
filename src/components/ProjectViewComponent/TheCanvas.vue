<script setup lang="ts">
import CanvasPaths from '@/components/ProjectViewComponent/CanvasPaths.vue';
import CanvasCards from '@/components/ProjectViewComponent/CanvasCards.vue';
import { computed, type ComputedRef, inject, onMounted, ref, watchEffect } from 'vue';
import { Register } from '@/graph/base';
import CanvasTempPaths from '@/components/ProjectViewComponent/CanvasTempPaths.vue';
import DragCanvas from '@/graph/behavior/drag-canvas';
import { DragCard } from '@/graph/behavior/drag-card';
import { ResizeCard } from '@/graph/behavior/resize-card';
import { DefaultBehavior } from '@/graph/behavior/default';
import { DoubleClickCard } from '@/graph/behavior/double-click-card';
import { CreateEdge } from '@/graph/behavior/create-edge';
import { Contextmenu } from '@/graph/behavior/contextmenu';
import WheelCanvas from '@/graph/behavior/wheel-canvas';
import type Project from '@/core/Project';

const svg = ref();
const project = inject<ComputedRef<Project>>('project');

onMounted(() => {
  watchEffect(() => {
    if (project.value.name) {
      const register = new Register(svg.value, project.value);
      register.addBehaviors(
        DefaultBehavior,
        DragCanvas,
        DragCard,
        ResizeCard,
        DoubleClickCard,
        CreateEdge,
        Contextmenu,
        WheelCanvas
      );
      register.listen();
    }
  });
});

const translateX = computed(() => project.value.offset.x);
const translateY = computed(() => project.value.offset.y);
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
