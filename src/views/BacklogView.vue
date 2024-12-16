<script setup lang="ts">
import { reactive, ref } from 'vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import BacklogItem from '@/components/BacklogItem.vue';
import { useBacklogStore } from '@/stores';
import type { Backlog } from '@/openapi'
import BasePageLayout from '@/components/layout/BasePageLayout.vue';

const backlogStore = useBacklogStore();

const viewModel = reactive({
  doneBacklogsVisible: false,
  selectId: '' // 选中的id
});

export type BacklogViewModel = typeof viewModel;

const inputRef = ref<HTMLInputElement>();

function handleInput() {
  if (inputRef.value) {
    backlogStore.add(inputRef.value.value.trim());
    inputRef.value.value = '';
  }
}

function handleUpdate(b1: Backlog, b2: Backlog) {
  [b1.index,b2.index] = [b2.index,b1.index];
}
</script>

<template>
  <base-page-layout title="备忘录" backgroundColor="#a0b6cd">
    <magic-draggable :update="handleUpdate" :list="backlogStore.todoBacklogs">
      <template #default="{ item }">
        <backlog-item :item="item" @update-status="(status) => item.status = status" @select="(id) => id && (viewModel.selectId = id)" />
      </template>
    </magic-draggable>
    <e-counter-button :count="backlogStore.doneBacklogs.length" v-model="viewModel.doneBacklogsVisible" />
    <magic-draggable
      v-if="viewModel.doneBacklogsVisible"
      :update="handleUpdate"
      :list="backlogStore.doneBacklogs"
    >
      <template #default="{ item }">
        <backlog-item :item="item" @update-status="(status) => item.status = status" @select="(id) => id && (viewModel.selectId = id)" />
      </template>
    </magic-draggable>
    <template #footer>
      <div class="mx-5 my-4 flex h-12 shrink-0 flex-row items-center overflow-hidden rounded-md">
        <div class="flex h-full w-14 shrink-0 items-center justify-center bg-white">
          <span class="icon-[fe--plus] h-6 w-6 bg-gray-500"></span>
        </div>
        <input
          @keydown.enter="handleInput"
          ref="inputRef"
          class="h-full w-full grow text-base text-gray-500"
          style="
            :focus {
              border: none;
              outline: none;
            }
          "
        />
      </div>
    </template>
  </base-page-layout>
</template>
