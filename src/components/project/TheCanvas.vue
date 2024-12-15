<script lang="ts" setup>
import { computed, onMounted, ref, type Ref } from 'vue';
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
  const register = new Register(svg as Ref<Element>);

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
    backgroundPositionX: project?.x + 'px',
    backgroundPositionY: project?.y + 'px',
  };
});
</script>

<template>
  <div class="relative bg-transparent">
    <svg ref="svg" :style="backgroundStyle" class="grid-line absolute h-full w-full" data-graph-item-shape="canvas"
      @contextmenu.prevent>
      <g :transform="`translate(${project?.x},${project?.y})`">
        <canvas-path v-for="item in paths" :key="item.id" :data="item" />
        <canvas-card v-for="item in cards" :key="item.id" :data="item" />
      </g>
    </svg>
    <canvas-menu :svg="svg! as SVGSVGElement" />
  </div>
</template>

<style scoped>
.grid-line {
  background-image: 
    /* 工作日和周末的背景色 - 使用渐变创建不同日期的背景 */
    repeating-linear-gradient(
      90deg,
      rgba(255, 255, 200, 0.1) 0,          /* 工作日背景开始 - 淡黄色 */
      rgba(255, 255, 200, 0.1) 360px,      /* 工作日背景结束 - 3天 x 120px */
      rgba(200, 255, 200, 0.3) 360px,      /* 周末背景开始 - 浅绿色 */
      rgba(200, 255, 200, 0.3) 600px,      /* 周末背景结束 - 2天 x 120px */
      rgba(255, 255, 200, 0.1) 600px,      /* 下一周工作日开始 */
      rgba(255, 255, 200, 0.1) 840px       /* 下一周工作日结束 - 2天 x 120px */
    ),
    /* 垂直网格线 - 用于分隔每一天 */
    repeating-linear-gradient(
      90deg,                               /* 水平方向的渐变 */
      transparent 0,                        /* 透明背景开始 */
      transparent 119px,                    /* 透明背景结束 */
      rgba(27, 31, 35, 0.1) 119px,         /* 网格线开始 - 浅灰色 */
      rgba(27, 31, 35, 0.1) 120px          /* 网格线结束 - 1px宽 */
    ),
    /* 水平网格线 - 用于分隔不同任务行 */
    repeating-linear-gradient(
      0deg,                                /* 垂直方向的渐变 */
      transparent 0,                        /* 透明背景开始 */
      transparent 79px,                     /* 透明背景结束 */
      rgba(27, 31, 35, 0.1) 79px,          /* 网格线开始 - 浅灰色 */
      rgba(27, 31, 35, 0.1) 80px           /* 网格线结束 - 1px高 */
    );
  background-size: 840px 80px;  /* 7天的总宽度 x 行高度 */
  background-repeat: repeat;
  background-blend-mode: normal;
}
</style>
