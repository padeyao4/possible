<script setup lang="ts">
import CanvasPaths from '@/components/ProjectViewComponent/CanvasPaths.vue';
import CanvasCards from '@/components/ProjectViewComponent/CanvasCards.vue';
import { computed, type ComputedRef, inject, onBeforeUnmount, onMounted, ref } from 'vue';
import CanvasTempPaths from '@/components/ProjectViewComponent/CanvasTempPaths.vue';
import { Project } from '@/core';
import { useSettings } from '@/stores';
import { storeToRefs } from 'pinia';
import {
  ClickCard,
  Contextmenu,
  CreateEdge,
  DefaultBehavior,
  DragCard,
  Register,
  ResizeCard,
  DragCanvas,
  WheelCanvas
} from '@/graph';

const svg = ref();
const settings = useSettings();
const { unitHeight, unitWidth } = storeToRefs(settings);
const project = inject<ComputedRef<Project>>('project');

const register = new Register(svg);

register.addBehaviors(
  DefaultBehavior,
  DragCanvas,
  DragCard,
  ResizeCard,
  ClickCard,
  CreateEdge,
  Contextmenu,
  WheelCanvas
);

onMounted(() => {
  register.listen();
});

onBeforeUnmount(() => {
  register.removeListen();
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
