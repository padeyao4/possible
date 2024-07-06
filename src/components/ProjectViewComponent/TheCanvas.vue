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
import { Project } from '@/core';
import CanvasGrid from '@/components/ProjectViewComponent/CanvasGrid.vue';
import { useSettings } from '@/stores';
import { storeToRefs } from 'pinia';

const svg = ref();
const settings = useSettings();
const { unitHeight, unitWidth } = storeToRefs(settings);
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

const uW = computed(() => `${unitWidth.value}px`);
const uH = computed(() => `${unitHeight.value}px`);

const position = computed(() => {
  return `${translateX.value}px ${translateY.value}px`;
});
</script>

<template>
  <div class="relative bg-transparent">
    <svg
      ref="svg"
      class="grid-line absolute h-full w-full"
      @contextmenu.prevent
      data-el-type="canvas"
      data-type="canvas"
    >
      <g :transform="`translate(${translateX},${translateY})`">
        <canvas-paths></canvas-paths>
        <canvas-cards></canvas-cards>
        <canvas-temp-paths></canvas-temp-paths>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.grid-line {
  background-image: linear-gradient(
      90deg,
      transparent 0px,
      transparent 119px,
      rgba(27, 31, 35, 0.06) 119px,
      rgba(27, 31, 35, 0.06) 120px
    ),
    linear-gradient(
      0deg,
      rgba(27, 31, 35, 0.06) 0px,
      rgba(27, 31, 35, 0.06) 1px,
      transparent 1px,
      transparent 80px
    );
  background-repeat: repeat;
  background-position: v-bind(position);
  background-size: v-bind(uW) v-bind(uH);
  background-blend-mode: normal;
}
</style>
