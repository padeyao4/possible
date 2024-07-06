<script setup lang="ts">
import { computed, type ComputedRef, inject, ref, watchEffect } from 'vue';
import { useSettings } from '@/stores/settings';
import CanvasHeaderItem from '@/components/ProjectViewComponent/CanvasHeaderItem.vue';
import { getDaysBetweenDates, useTimer } from '@/stores/timer';
import { useWindowSize } from '@vueuse/core';
import type { Project } from '@/core';

const settings = useSettings();
const indexes = ref<number[]>([]);
const project = inject<ComputedRef<Project>>('project');
const timer = useTimer();

const { width } = useWindowSize();

watchEffect(() => {
  const count = Math.ceil(width.value / settings.unitWidth);
  indexes.value = Array.from({ length: count }, (_, i) => i + 1);
});

const x = computed(() => Math.floor(-project.value.offset.x / settings.unitWidth) - 2);

const translateX = computed(
  () => (project.value.offset.x % settings.unitWidth) - settings.unitWidth + 'px'
);

const unitWidth = computed(() => settings.unitWidth + 'px');

const todayIndex = computed(() => getDaysBetweenDates(timer.timestamp, project.value.createTime));
</script>

<template>
  <div class="canvas-header">
    <div class="container">
      <div v-for="idx in indexes" class="item" :key="idx">
        <canvas-header-item :idx="idx + x" :isToday="todayIndex === idx + x" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-header {
  display: flex;
  flex-direction: row;
  height: 40px;
  overflow-x: hidden;
  background-color: transparent;
  border-bottom: 1px solid #00000010;
  pointer-events: none;
}

.container {
  display: flex;
  flex-direction: row;
  transform: translateX(v-bind(translateX));
}

.item {
  flex-shrink: 0;
  width: v-bind(unitWidth);
}
</style>
