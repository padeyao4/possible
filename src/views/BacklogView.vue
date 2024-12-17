<script setup lang="ts">
import BacklogItem from '@/components/BacklogItem.vue';
import ECounterButton from '@/components/common/CounterButton.vue';
import MagicDraggable from '@/components/common/MagicDraggable.vue';
import { reactive, ref } from 'vue';
import BasePageLayout from '@/components/layout/BasePageLayout.vue';
import { generateIndex, usePlanStore, type Plan } from '@/stores';
import { v4 } from 'uuid';

const planStore = usePlanStore();

const viewModel = reactive({
  doneBacklogsVisible: false,
  selectId: '' // 选中的id
});

export type BacklogViewModel = typeof viewModel;

const inputRef = ref<HTMLInputElement>();

function handleInput() {
  if (inputRef.value) {
    planStore.addPlan({
      id: v4(),
      name: inputRef.value?.value.trim() || '',
      isDone: false,
      index: generateIndex(),
      createdAt: Date.now()
    }, false, true);
    inputRef.value.value = '';
  }
}

function handleUpdate(b1: Plan, b2: Plan) {
  [b1.index, b2.index] = [b2.index, b1.index];
}
</script>

<template>
  <base-page-layout title="备忘录" backgroundColor="#a0b6cd">
    <magic-draggable :update="handleUpdate" :list="planStore.todoBacklogs">
      <template #default="{ item }">
        <backlog-item :item="item" @update-status="(status) => item.isDone = status"
          @select="(id) => id && (viewModel.selectId = id)" />
      </template>
    </magic-draggable>
    <e-counter-button :count="planStore.doneBacklogs.length" v-model="viewModel.doneBacklogsVisible" />
    <magic-draggable v-if="viewModel.doneBacklogsVisible" :update="handleUpdate" :list="planStore.doneBacklogs">
      <template #default="{ item }">
        <backlog-item :item="item" @update-status="(status) => item.isDone = !status"
          @select="(id) => id && (viewModel.selectId = id)" />
      </template>
    </magic-draggable>
    <template #footer>
      <div class="mx-5 my-4 flex h-12 shrink-0 flex-row items-center overflow-hidden rounded-md">
        <div class="flex h-full w-14 shrink-0 items-center justify-center bg-white">
          <span class="icon-[fe--plus] h-6 w-6 bg-gray-500"></span>
        </div>
        <input @keydown.enter="handleInput" ref="inputRef" class="h-full w-full grow text-base text-gray-500" style="
            :focus {
              border: none;
              outline: none;
            }
          " />
      </div>
    </template>
  </base-page-layout>
</template>
