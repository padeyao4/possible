<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { showWeek, timeFormat } from '@/stores/timer';
import type { Project } from '@/core';

const props = defineProps<{
  idx: number;
  isToday: boolean;
}>();

const project = inject<ComputedRef<Project>>('project');

const date = computed(() => {
  const startTimestamp = project.value.createTime;
  const indexTimestamp = startTimestamp + props.idx * 86400_000;
  return new Date(indexTimestamp);
});

const info = computed(() => {
  return timeFormat.format(date.value) + ' ' + showWeek(date.value);
});
</script>

<template>
  <div :class="['time-cell', { today: isToday }]">
    {{ info }}
  </div>
</template>

<style scoped>
.time-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-weight: lighter;
  font-size: 14px;
  border-right: 1px solid #00000010;
}

.today {
  background-color: #95d47570;
}
</style>
