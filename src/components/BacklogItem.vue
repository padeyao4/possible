<script setup lang="ts">
import { inject, provide, type Ref, ref } from 'vue';
import { Backlog } from '@/core';
import { Check } from '@element-plus/icons-vue';
import emitter from '@/utils/emitter';
import type BacklogEditor from '@/components/BacklogEditor.vue';

const { item } = defineProps<{
  item: Backlog;
}>();

const handleIconClick = () => {
  item.set({ done: !item.done });
};

const editorVisible = inject<Ref<boolean>>('editorVisible');
const backlogEditorEl = inject<Ref<typeof BacklogEditor>>('backlogEditorEl');

const handleTextClick = () => {
  const current: Backlog = backlogEditorEl.value.current;
  if (editorVisible.value) {
    emitter.emit(current?.id === item.id ? 'backlog:close' : 'backlog:open', item);
  } else {
    emitter.emit('backlog:open', item);
  }
};

const showIcon = ref(false);
</script>

<template>
  <div
    class="flex h-14 w-full items-center rounded-lg border border-gray-200 hover:bg-blue-100"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500"
      @click="handleIconClick"
    >
      <el-icon v-show="item.done" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow items-center overflow-hidden" @click="handleTextClick">
      <el-text truncated> {{ item.title }} </el-text>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block shrink-0 border border-black text-xl"
      data-move
    />
  </div>
</template>
