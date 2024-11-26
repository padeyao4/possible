<script setup lang="ts">
import { type ComputedRef, inject } from 'vue';
import { type Project, useGraph } from '@/stores';

const graph = useGraph();
const project = inject<ComputedRef<Project>>('project');
</script>

<template>
  <template v-for="item in graph.getPathsByProjectId(project.id)" :key="item.id">
    <path
      :d="`M ${item.startX},${item.startY} C ${item.controller1X},${item.controller1Y} ${item.controller2X},${item.controller2Y} ${item.targetX},${item.targetY}`"
      stroke="#000000"
      fill="#ffffff00"
      :data-key="item.id"
      data-el-type="edge"
      stroke-opacity="0.3"
      stroke-width="1"
    />
<!--    <path
      :d="`M ${item.startX},${item.startY} C ${item.controller1X},${item.controller1Y} ${item.controller2X},${item.controller2Y} ${item.targetX},${item.targetY}`"
      stroke="#00000050"
      fill="#ffffff00"
      :data-key="item.id"
      opacity="0"
      data-mouse-style="pointer"
      data-el-type="edge"
      stroke-opacity="0.7"
      stroke-width="9"
    />-->
  </template>
</template>

<style scoped></style>
