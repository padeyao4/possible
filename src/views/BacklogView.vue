<script setup lang="ts">
import { provide, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import { useBacklogs, useLayout } from '@/stores';
import { Backlog } from '@/core';
import BacklogItem from '@/components/BacklogItem.vue';

const backlogs = useBacklogs();
const layout = useLayout();
layout.showRight = false;

const onUpdate = (current: Backlog, other: Backlog) => {
  [current.orderIndex, other.orderIndex] = [other.orderIndex, current.orderIndex];
};

const inputEl = ref<HTMLInputElement>();

const addNew = () => {
  const value = inputEl.value.value.trim();
  if (!value) return;
  backlogs.add(value);
  inputEl.value.value = '';
};

const editorVisible = ref(false);
const editorBacklog = ref();

provide('editorVisible', editorVisible);
provide('editorBacklog', editorBacklog);

const counterVisible = ref(false);
</script>

<template>
  <div class="flex h-screen w-full flex-col" style="background-color: #a0b6cd">
    <div
      class="drag-region flex shrink-0 items-end truncate px-3 pb-3 text-xl text-gray-600"
      style="height: 64px"
    >
      备忘录
    </div>
    <el-scrollbar class="grow px-3">
      <e-draggable :update="onUpdate" :list="backlogs.todos" handle="data-move">
        <template #default="{ item }">
          <backlog-item :item="item as Backlog" class="my-1" />
        </template>
      </e-draggable>
      <e-counter-button :count="backlogs.completes.length" v-model="counterVisible" />
      <e-draggable
        v-if="counterVisible"
        :update="onUpdate"
        :list="backlogs.completes"
        handle="data-move"
      >
        <template #default="{ item }">
          <backlog-item :item="item as Backlog" class="my-1" />
        </template>
      </e-draggable>
    </el-scrollbar>
    <div class="mx-3 my-4 flex h-12 shrink-0 flex-row items-center overflow-hidden rounded-md">
      <div class="flex h-full w-14 shrink-0 items-center justify-center bg-white">
        <span class="icon-[fe--plus] h-6 w-6 bg-gray-500"></span>
      </div>
      <input
        @keydown.enter="addNew"
        ref="inputEl"
        class="h-full w-full grow text-base text-gray-500"
        style="
          :focus {
            border: none;
            outline: none;
          }
        "
      />
    </div>
  </div>
</template>
