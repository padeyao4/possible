<script setup lang="ts">
import { showWeekAndLocalDate, useTime } from '@/stores/timer';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import { Node } from '@/core';
import TodayItem from '@/components/TodayItem.vue';
const completeVisible = ref(false);

const timeStore = useTime();

const dateTime = computed(() => showWeekAndLocalDate(timeStore.localTimestamp));

function onUpdate(n1: Node, n2: Node) {
  [n1.sortedIndex, n2.sortedIndex] = [n2.sortedIndex, n1.sortedIndex];
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
