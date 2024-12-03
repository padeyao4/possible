<script setup lang="ts">
import { computed } from 'vue';
import { days, ONE_DAY_MS, useGraph } from '@/stores';

const graph = useGraph();

const project = graph.project;

const offsetX = computed(() => Math.floor(-project.x / graph.cardWidth));

const numbers = computed(() =>
  Array.from(
    { length: Math.ceil(graph.viewWidth / graph.cardWidth) },
    (_, i) => i + (offsetX.value < 0 ? offsetX.value + 1 : offsetX.value) - 2
  )
);

const translateX = computed(() => (project.x % graph.cardWidth) - graph.cardWidth + 'px');

const unitWidth = computed(() => graph.cardWidth + 'px');

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

const todayIndex = computed(() => {
  return days(graph.timestamp);
});
</script>

<template>
  <div class="canvas-header">
    <div class="container">
      <div
        v-for="n in numbers"
        :key="n"
        :class="['item time-cell', { today: n + 1 === todayIndex }]"
      >
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
