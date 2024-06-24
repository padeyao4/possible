<script setup lang="ts">
import CanvasCardItem from '@/components/ProjectViewComponent/CanvasCardItem.vue';
import { isCross } from '@/graph/math';
import { useSettings } from '@/stores/settings';
import { useWindowSize } from '@vueuse/core';
import { computed, type ComputedRef, inject } from 'vue';
import type Project from '@/core/Project';

const settings = useSettings();
const project = inject<ComputedRef<Project>>('project');

const { width: windowWidth, height: windowHeight } = useWindowSize();

const rect = computed(() => {
  const x = -project.value.offset.x / settings.unitWidth;
  const width = windowWidth.value / settings.unitWidth;
  const y = -project.value.offset.y / settings.unitHeight;
  const height = windowHeight.value / settings.unitHeight;
  return {
    x,
    y,
    width,
    height
  };
});

const nodes = computed(() => {
  return Array.from(project.value.nodeMap.values()).filter((node) => isCross(rect.value, node));
});
</script>

<template>
  <canvas-card-item v-for="node in nodes" :node="node" :key="node.id" />
</template>

<style scoped></style>
