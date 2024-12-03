<script setup lang="ts">
import { type DateType, type Node, useGraph } from '@/stores';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import TodayItem from '@/components/TodayItem.vue';

const completeVisible = ref(false);

const graph = useGraph();

/**
 * 表头显示的时间格式
 * @param dateType
 */
function showWeekAndLocalDate(dateType: DateType) {
  const date = typeof dateType === 'object' ? dateType : new Date(dateType);
  const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const dayIndex = adjustedDate.getDay();
  const localDate = adjustedDate.toLocaleDateString();
  return `${localDate} ${days[dayIndex]}`;
}

const dateTime = computed(() => showWeekAndLocalDate(graph.timestamp));

function onUpdate(n1: Node, n2: Node) {
  [n1.index, n2.index] = [n2.index, n1.index];
}
</script>

<template>
  <div class="flex h-screen flex-col" style="background-color: #82bbb5">
    <div class="drag-region mb-3">
      <div class="flex w-full shrink-0 items-end px-3 text-xl text-gray-600" style="height: 52px">
        我的一天
      </div>
      <div class="ml-3 text-xs text-gray-500">{{ dateTime }}</div>
    </div>
    <div v-if="true" class="grow px-3" />
    <el-scrollbar v-else class="grow px-3" always>
      <e-draggable :update="onUpdate" :list="[]" handle="data-move">
        <template #default="{ item }">
          <today-item :node="item" class="odd:my-1" />
        </template>
      </e-draggable>
      <e-counter-button :count="0" v-model="completeVisible" />
      <e-draggable v-if="completeVisible" :update="() => {}" :list="[]" handle="data-move">
        <template #default="{ item }">
          <today-item :node="item" class="my-1" />
        </template>
      </e-draggable>
      <div class="h-1" />
    </el-scrollbar>
  </div>
</template>
