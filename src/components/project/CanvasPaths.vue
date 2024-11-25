<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
// import { useSettings } from '@/stores/card';
// import type { Path } from '@/core/types';
// import CanvasThePath from '@/components/project/CanvasThePath.vue';
// import type { Project } from '@/core';
//
import { type Project, useGraph } from '@/stores';

const graph = useGraph();
const project = inject<ComputedRef<Project>>('project');
// const setting = useSettings();
//
// const edges = computed<Path[]>(() => {
//   const { nodeMap, edgeMap } = project.value;
//   const ans = [];
//   const { unitWidth, unitHeight } = setting;
//   for (let edge of edgeMap.values()) {
//     const sourceNode = nodeMap.get(edge.source);
//     const sx = (sourceNode.x + sourceNode.width) * unitWidth - setting.offsetCardX;
//     const sy = (sourceNode.y + sourceNode.height / 2) * unitHeight;
//
//     const targetNode = nodeMap.get(edge.target);
//     const tx = targetNode.x * unitWidth + setting.offsetCardX;
//     const ty = (targetNode.y + targetNode.height / 2) * unitHeight;
//
//     ans.push({
//       id: edge.id,
//       from: { x: sx, y: sy },
//       to: { x: tx, y: ty }
//     });
//   }
//   return ans;
// });
// import type { Path } from '@/core'
</script>

<template>
  <!--  <canvas-the-path v-for="edge in edges" :edge="edge" :key="edge.id" />-->

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
<!--    <path-->
<!--      :d="`M ${item.startX},${item.startY} C ${item.controller1X},${item.controller1Y} ${item.controller2X},${item.controller2Y} ${item.targetX},${item.targetY}`"-->
<!--      stroke="#00000050"-->
<!--      fill="#ffffff00"-->
<!--      :data-key="item.id"-->
<!--      opacity="0"-->
<!--      data-mouse-style="pointer"-->
<!--      data-el-type="edge"-->
<!--      stroke-opacity="0.7"-->
<!--      stroke-width="9"-->
<!--    />-->
  </template>
</template>

<style scoped></style>
