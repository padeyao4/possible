<script lang="ts" setup>
import { computed, onMounted, provide, ref } from 'vue';
import { useGraph } from '@/stores';
import {
  ClickCard,
  ClickCanvasMenu,
  CreateEdge,
  DefaultBehavior,
  DragCanvas,
  DragCard,
  Register,
  ResizeCard,
  WheelCanvas
} from '@/graph';
import CanvasCard from '@/components/project/CanvasCard.vue';
import CanvasPath from '@/components/project/CanvasPath.vue';
import CanvasMenu from '@/components/CanvasMenu.vue';

const graph = useGraph();
const project = graph.project;
const svg = ref<SVGSVGElement>();
const cards = computed(() => graph.currentCards);
const paths = computed(() => graph.currentPaths);

onMounted(() => {
  const register = new Register(svg);

  register.addBehaviors(
    DefaultBehavior,
    DragCanvas,
    DragCard,
    ResizeCard,
    ClickCard,
    CreateEdge,
    ClickCanvasMenu,
    WheelCanvas
  );

  register.listen();
});
</script>

<template>
  <div class="relative bg-transparent">
    <svg
      ref="svg"
      :style="{
        backgroundPositionX: project.x + 'px',
        backgroundPositionY: project.y + 'px',
        backgroundSize: `${graph.cardWidth}px ${graph.cardHeight}px`
      }"
      class="grid-line absolute h-full w-full"
      data-item-type="canvas"
      data-graph-item="canvas"
      @contextmenu.prevent
    >
      <g :transform="`translate(${project.x},${project.y})`">
        <canvas-path v-for="item in paths" :key="item.id" :data="item" />
        <canvas-card v-for="item in cards" :key="item.id" :data="item" />
        <!--        <canvas-temp-paths></canvas-temp-paths>-->
      </g>
    </svg>
    <canvas-menu :svg="svg" />
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
  background-blend-mode: normal;
}
</style>
