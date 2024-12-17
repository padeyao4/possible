<script setup lang="ts">
import { CARD_WIDTH, days, ONE_DAY_MS, useLayoutStore, type Plan } from '@/stores';
import { computed } from 'vue';

const { project, width } = defineProps<{
  project: Plan;
  height: number;
  width: number;
}>();

const layoutStore = useLayoutStore();


const numbers = computed(() => {
  const ox = -Math.ceil(project.offsetX! / CARD_WIDTH);
  return Array.from(
    { length: Math.ceil(width / CARD_WIDTH) + 1 },
    (_, i) => i + (ox < 0 ? ox + 1 : ox) - 2
  );
});

const translateX = computed(() => project.offsetX! % CARD_WIDTH - CARD_WIDTH);

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
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('zh-Hans').format(date) + ' ' + formatWeek(date);
}

function showDateInfo(index: number) {
  return formatDate(new Date(index * ONE_DAY_MS));
}

const todayIndex = computed(() => {
  return days(layoutStore.timestamp);
});
</script>

<template>
  <div class="canvas-header">
    <div class="container" :style="{ transform: `translateX(${translateX}px)` }">
      <div v-for="n in numbers" :key="n" :class="['item time-cell', { today: n + 1 === todayIndex }]"
        :style="{ width: `${CARD_WIDTH}px` }">
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
}

.item {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: lighter;
  font-size: 14px;
  border-right: 1px solid #00000010;
}

.today {
  background-color: #95d47570;
}
</style>
