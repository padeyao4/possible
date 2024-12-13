<script setup lang="ts">
import type { Path } from '@/core/types';
import { computed } from 'vue';

const props = defineProps<{ edge: Path }>();

const disX = computed(() => {
  return -Math.abs(props.edge.to.x - props.edge.from.x);
});

const ctl1 = computed(() => {
  return {
    x: props.edge.from.x + disX.value / 2,
    y: props.edge.from.y
  };
});

const ctl2 = computed(() => {
  return {
    x: props.edge.to.x - disX.value / 2,
    y: props.edge.to.y
  };
});
</script>

<template>
  <path
    :d="`M ${edge.from.x},${edge.from.y} C ${ctl1.x},${ctl1.y} ${ctl2.x},${ctl2.y} ${edge.to.x},${edge.to.y}`"
    stroke="#000"
    :opacity="0.7"
    :data-graph-item-id="edge.id"
    data-graph-item="path"
    pointer-events="none"
    stroke-opacity="0.7"
    fill="#ffffff00"
    stroke-width="1"
  />
</template>

<style scoped></style>
