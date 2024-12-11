<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useDataStore } from '@/stores';
import {
  ClickCanvasMenu,
  ClickCard,
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

const graph = useDataStore();
const project = graph.project;
const svg = ref<SVGSVGElement>();
const cards = computed(() => graph.drawableCards);
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

const backgroundStyle = computed(() => {
  return {
    backgroundPositionX: project.x + 'px',
    backgroundPositionY: project.y + 'px',
    backgroundSize: `${graph.cardWidth}px ${graph.cardHeight}px`
  };
});
</script>

<template>
  <div class="relative bg-transparent">
    <svg
      ref="svg"
      :style="backgroundStyle"
      class="grid-line absolute h-full w-full"
      data-graph-item-shape="canvas"
      @contextmenu.prevent
    >
      <g :transform="`translate(${project.x},${project.y})`">
        <canvas-path v-for="item in paths" :key="item.id" :data="item" />
        <canvas-card v-for="item in cards" :key="item.id" :data="item" />
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
