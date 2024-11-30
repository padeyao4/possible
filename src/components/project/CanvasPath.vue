<script lang="ts" setup>
import { type ID } from '@/stores';
import { computed, ref } from 'vue';

const { data } = defineProps<{
  data: {
    id: ID;
    startX: number;
    startY: number;
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
  return `M ${data.startX},${data.startY} C ${data.controller1X},${data.controller1Y} ${data.controller2X},${data.controller2Y} ${data.targetX},${data.targetY}`;
});
</script>

<template>
  <path
    :d="style"
    :data-item-id="data.id"
    data-item-type="edge"
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
    :data-item-id="data.id"
    opacity="0"
    data-mouse-style="pointer"
    data-item-type="edge"
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
