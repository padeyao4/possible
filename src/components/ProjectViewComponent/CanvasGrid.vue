<script setup lang="ts">
import { useSettings } from '@/stores/settings';
import { computed, type ComputedRef, inject } from 'vue';
import type { Project } from '@/core';

const settings = useSettings();
const project = inject<ComputedRef<Project>>('project');

const translateX = computed(() => (project.value.offset.x % settings.unitWidth) + 'px');

const translateY = computed(() => (project.value.offset.y % settings.unitHeight) + 'px');

const width = computed(() => settings.unitWidth + 'px');

const height = computed(() => settings.unitHeight + 'px');
</script>

<template>
  <div class="canvas-grid">
    <div class="container" />
  </div>
</template>

<style scoped>
.canvas-grid {
  width: 100%;
  overflow: hidden;
  background: #00000000;
  pointer-events: none;
}

.container {
  width: 200%;
  height: 200%;
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
  background-size: v-bind(width) v-bind(height);
  background-blend-mode: normal;
  transform: translateX(v-bind(translateX)) translateY(v-bind(translateY));
}
</style>
