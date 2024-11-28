<script lang="ts" setup>
import { type ID } from '@/stores';

defineProps<{
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
</script>

<template>
  <path
    :d="`M ${data.startX},${data.startY} C ${data.controller1X},${data.controller1Y} ${data.controller2X},${data.controller2Y} ${data.targetX},${data.targetY}`"
    :data-item-id="data.id"
    data-item-type="edge"
    fill="#ffffff00"
    stroke="#000000"
    stroke-opacity="0.3"
    stroke-width="1"
  />
  <!--    <path
    :d="`M ${data.startX},${data.startY} C ${data.controller1X},${data.controller1Y} ${data.controller2X},${data.controller2Y} ${data.targetX},${data.targetY}`"
    stroke="#00000050"
    fill="#ffffff00"
    :data-item-id="data.id"
    opacity="0"
    data-mouse-style="pointer"
    data-item-type="edge"
    stroke-opacity="0.7"
    stroke-width="9"
  />-->
</template>

<style scoped></style>
