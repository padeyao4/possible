<script setup lang="ts">
import { type DateType, type Plan, useLayoutStore, usePlanStore } from '@/stores';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import TodayItem from '@/components/TodayItem.vue';
import BasePageLayout from '@/components/layout/BasePageLayout.vue';

const layoutStore = useLayoutStore();
const completeVisible = ref(false);

const planStore = usePlanStore();

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

const dateTime = computed(() => showWeekAndLocalDate(layoutStore.timestamp));

function onUpdate(n1: Plan, n2: Plan) {
  [n1.index, n2.index] = [n2.index, n1.index];
}
</script>

<template>
  <base-page-layout title="我的一天">
    <template #subtitle>
      <div class="text-xs text-gray-500">{{ dateTime }}</div>
    </template>

    <div v-if="planStore.todayPlans.length === 0" />
    <template v-else>
      <MagicDraggable :update="onUpdate" :list="planStore.todoPlans">
        <template #default="{ item }">
          <today-item :plan="item" class="odd:my-1" @update-status="(status) => item.isDone = status" />
        </template>
      </MagicDraggable>
      <e-counter-button :count="planStore.donePlans.length" v-model="completeVisible" />
      <MagicDraggable v-if="completeVisible" :update="onUpdate" :list="planStore.donePlans">
        <template #default="{ item }">
          <today-item :plan="item" class="my-1" @update-status="(status) => item.isDone = status" />
        </template>
      </MagicDraggable>
      <div class="h-1" />
    </template>
  </base-page-layout>
</template>
