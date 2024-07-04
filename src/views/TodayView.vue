<script setup lang="ts">
import ItemComponent from '@/components/TodayList/ItemComponent.vue';
import { handleNewProject } from '@/service/project.service';
import { useProjectStore } from '@/stores/project';
import { showWeekAndLocalDate, useTimer } from '@/stores/timer';
import { computed, ref } from 'vue';
import ECounterButton from '@/components/common/ECounterButton.vue';
import EDraggable from '@/components/common/EDraggable.vue';
import { Node } from '@/core';
import { Plus } from '@element-plus/icons-vue';
import TodayItem from '@/components/TodayItem.vue';

const visible = ref(false);

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
  <div class="flex h-screen flex-col p-3">
    <div class="drag-region flex h-10 w-full shrink-0 items-end text-xl text-gray-600">
      我的一天
    </div>
    <div class="mb-2">
      <el-text size="small">{{ dateTime }}</el-text>
    </div>
    <el-scrollbar class="grow">
      <e-draggable :update="() => {}" :list="projects.todoList" handle="data-move">
        <template #default="{ item }">
          <today-item :node="item" />
        </template>
      </e-draggable>
      <e-counter-button :count="projects.completedList.length" />
      <e-draggable :update="() => {}" :list="projects.completedList" handle="data-move">
        <template #default="{ item }">
          <today-item :node="item" />
        </template>
      </e-draggable>
    </el-scrollbar>
  </div>
</template>
