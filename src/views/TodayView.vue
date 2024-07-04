<script setup lang="ts">
import { useProjectStore } from '@/stores/project';
import { showWeekAndLocalDate, useTimer } from '@/stores/timer';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { Node } from '@/core';
import TodayItem from '@/components/TodayItem.vue';

const completeVisible = ref(false);

const timer = useTimer();

const dateTime = computed(() => showWeekAndLocalDate(timer.localTimestamp));

const projects = useProjectStore();

function onUpdate(n1: Node, n2: Node) {
  [n1.sortedIndex, n2.sortedIndex] = [n2.sortedIndex, n1.sortedIndex];
}

const showWelcome = computed(() => {
  return projects.todoList.length === 0 && projects.completedList.length === 0;
});
</script>

<template>
  <div class="flex h-screen flex-col pt-3">
    <div class="drag-region flex h-10 w-full shrink-0 items-end px-3 text-xl text-gray-600">
      我的一天
    </div>
    <div class="mb-2 px-3">
      <el-text size="small">{{ dateTime }}</el-text>
    </div>
    <div v-if="showWelcome" class="grow px-3" />
    <el-scrollbar v-else class="grow px-3" always>
      <e-draggable :update="onUpdate" :list="projects.todoList" handle="data-move">
        <template #default="{ item }">
          <today-item :node="item" class="odd:my-1" />
        </template>
      </e-draggable>
      <e-counter-button :count="projects.completedList.length" v-model="completeVisible" />
      <e-draggable
        v-if="completeVisible"
        :update="() => {}"
        :list="projects.completedList"
        handle="data-move"
      >
        <template #default="{ item }">
          <today-item :node="item" class="my-1" />
        </template>
      </e-draggable>
      <div class="h-1" />
    </el-scrollbar>
  </div>
</template>
