<script setup lang="ts">
import { useProjects } from '@/stores/project';
import { showWeekAndLocalDate, useTimer } from '@/stores/timer';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import { Node } from '@/core';
import TodayItem from '@/components/TodayItem.vue';
import { useLayout } from '@/stores';

const layout = useLayout();
layout.showRight = false;

const completeVisible = ref(false);

const timer = useTimer();

const dateTime = computed(() => showWeekAndLocalDate(timer.localTimestamp));

const projects = useProjects();

function onUpdate(n1: Node, n2: Node) {
  [n1.sortedIndex, n2.sortedIndex] = [n2.sortedIndex, n1.sortedIndex];
}

const showWelcome = computed(() => {
  return projects.todoList.length === 0 && projects.completedList.length === 0;
});
</script>

<template>
  <div class="flex h-screen flex-col" style="background-color: #82bbb5">
    <div class="drag-region mb-3">
      <div class="flex w-full shrink-0 items-end px-3 text-xl text-gray-600" style="height: 52px">
        我的一天
      </div>
      <div class="ml-3 text-xs text-gray-500">{{ dateTime }}</div>
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
