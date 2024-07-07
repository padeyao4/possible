<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import { Plus } from '@element-plus/icons-vue';
import EDraggable from '@/components/common/MagicDraggable.vue';
import { useBacklogs } from '@/stores';
import { Backlog } from '@/core';
import BacklogItem from '@/components/BacklogItem.vue';
import BacklogEditor from '@/components/BacklogEditor.vue';

const backlogs = useBacklogs();

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

const width = computed(() => (editorVisible.value ? 'calc( 100% - 320px )' : '100%'));

const editorVisible = ref(false);
const editorBacklog = ref();

provide('editorVisible', editorVisible);
provide('editorBacklog', editorBacklog);

const counterVisible = ref(false);
</script>

<template>
  <div class="flex h-screen w-full flex-row">
    <div class="flex h-screen flex-col" :style="{ width }">
      <div
        class="drag-region flex shrink-0 items-end truncate px-3 pb-3 text-xl text-gray-500"
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
      <div
        class="mx-3 my-4 flex h-12 shrink-0 flex-row items-center overflow-hidden rounded-md border border-gray-200"
      >
        <div class="flex h-full w-14 shrink-0 items-center justify-center border-r border-gray-200">
          <el-icon size="26"><Plus /></el-icon>
        </div>
        <input
          @keydown.enter="addNew"
          ref="inputEl"
          class="h-full w-full grow p-2 text-base text-gray-500"
          style="
            :focus {
              border: none;
              outline: none;
            }
          "
        />
      </div>
    </div>
    <backlog-editor
      v-model:visible="editorVisible"
      v-model:backlog="editorBacklog"
      class="shrink-0 border-l border-gray-300"
    />
  </div>
</template>
