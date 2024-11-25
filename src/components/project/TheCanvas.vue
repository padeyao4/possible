<script setup lang="ts">
// import CanvasPaths from '@/components/project/CanvasPaths.vue';
import { type ComputedRef, inject, onMounted, provide, ref } from 'vue';
// import CanvasTempPaths from '@/components/project/CanvasTempPaths.vue';
import { type Project, useCard, useGraph } from '@/stores';
import {
  ClickCard,
  Contextmenu,
  CreateEdge,
  DefaultBehavior,
  DragCanvas,
  DragCard,
  Register,
  ResizeCard,
  WheelCanvas
} from '@/graph';
import GraphContextmenuGroup from '@/components/project/GraphContextmenuGroup.vue';
import CanvasCard from '@/components/project/CanvasCard.vue';
// import CanvasPaths from '@/components/project/CanvasPaths.vue'

const graph = useGraph();
const svg = ref();
const card = useCard();
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

provide('canvasContainer', svg);
</script>

<template>
  <div class="relative bg-transparent">
    <svg
      ref="svg"
      class="grid-line absolute h-full w-full"
      :style="{
        backgroundPositionX: project.x + 'px',
        backgroundPositionY: project.y + 'px',
        backgroundSize: `${card.w}px ${card.h}px`
      }"
      @contextmenu.prevent
      data-el-type="canvas"
      data-type="canvas"
    >
      <g :transform="`translate(${project.x},${project.y})`">
        <!--        <canvas-paths></canvas-paths>-->
<!--        <canvas-paths/>-->
        <canvas-card
          v-for="item in graph.getCardsByProjectId(project.id)"
          :card="item"
          :key="item.id"
        />
        <!--        <canvas-temp-paths></canvas-temp-paths>-->
      </g>
    </svg>
  </div>
  <graph-contextmenu-group />
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
  background-blend-mode: normal;
}
</style>
