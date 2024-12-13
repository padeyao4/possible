<script lang="ts" setup>
import { computed, ref } from 'vue';

const { data } = defineProps<{
  data: {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    controller1X: number;
    controller1Y: number;
    controller2X: number;
    controller2Y: number;
  };
}>();

const path = ref<SVGPathElement>();

const style = computed(() => {
  return `M ${data.sourceX},${data.sourceY} C ${data.controller1X},${data.controller1Y} ${data.controller2X},${data.controller2Y} ${data.targetX},${data.targetY}`;
});
</script>

<template>
  <path
    :d="style"
    :data-graph-item-id="data.id"
    data-graph-item-shape="edge"
    fill="none"
    stroke="#000000"
    stroke-opacity="0.3"
    stroke-width="1"
  />
  <path
    ref="path"
    :d="style"
    stroke="#00000050"
    fill="none"
    :data-graph-item-id="data.id"
    opacity="0"
    data-mouse-style="pointer"
    data-graph-item-shape="edge"
    stroke-opacity="0.7"
    stroke-width="9"
    pointer-events="visibleStroke"
  />
</template>

<style scoped>
path:hover {
  opacity: 0.8;
}
</style>
