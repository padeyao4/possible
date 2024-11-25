<script setup lang="ts">
import { computed, type ComputedRef, inject } from 'vue';
import { useCard } from '@/stores/card';
import { ONE_DAY_MS, type Project } from '@/stores';
import { useWindowSize } from '@vueuse/core';

const card = useCard();

const project = inject<ComputedRef<Project>>('project');

const { width: windowWidth } = useWindowSize();

const offsetX = computed(() => Math.floor(-project.value.x / card.w) - 2);

const numbers = computed(() =>
  Array.from({ length: Math.ceil(windowWidth.value / card.w) }, (_, i) => i + 1 + offsetX.value)
);

const translateX = computed(() => (project.value.x % card.w) - card.w + 'px');

const unitWidth = computed(() => card.w + 'px');

// const todayIndex = computed(() => getDaysBetweenDates(timer.timestamp, project.value.createTime));

/**
 * 显示一个日期是周几
 */
function formatWeek(date: Date): string {
  return '周' + ['日', '一', '二', '三', '四', '五', '六'][date.getDay()];
}

/**
 * 格式化日期 显示格式为：
 * 2023-01-01 周一
 */
function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-Hans').format(date) + ' ' + formatWeek(date);
}

function showDateInfo(index: number) {
  return formatDate(new Date(index * ONE_DAY_MS));
}
</script>

<template>
  <div class="canvas-header">
    <div class="container">
      <div v-for="n in numbers" class="item time-cell" :key="n" :class="[{ today: false }]">
        {{ showDateInfo(n) }}
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
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: v-bind(unitWidth);
  height: 100%;
  font-weight: lighter;
  font-size: 14px;
  border-right: 1px solid #00000010;
}

.today {
  background-color: #95d47570;
}
</style>
