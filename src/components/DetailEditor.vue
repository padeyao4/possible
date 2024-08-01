<script setup lang="ts">
import { emitter } from '@/utils';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { onBeforeUnmount, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import { useLayout } from '@/stores';

const layout = useLayout();

const item = ref();
const itemType = ref();

emitter.on('editor:open', (e) => {
  if (!layout.showRight || e.type !== itemType.value || e.item.id !== item.value?.id) {
    layout.showRight = true;
    item.value = e.item;
    itemType.value = e.type;
  } else {
    layout.showRight = false;
  }
});

emitter.on('editor:close', () => {
  layout.showRight = false;
});

onBeforeUnmount(() => {
  emitter.off('editor:open');
  emitter.off('editor:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    layout.showRight = false;
  }
});
</script>

<template>
  <div class="flex h-screen flex-col" v-if="layout.showRight">
    <header
      class="drag-region mb-3 flex w-full shrink-0 items-end justify-between"
      style="height: 36px"
    >
      <close-icon-button
        class="no-drag-region ml-2.5 rounded-md border border-gray-300"
        @click="layout.showRight = false"
      />
      <div
        class="h-full rounded-bl-lg border border-b border-l border-gray-200"
        style="width: 139px"
      ></div>
    </header>
    <el-scrollbar class="grow">
      <template v-if="itemType === 'backlog'">
        <div class="m-3">
          <el-input
            type="textarea"
            size="large"
            v-model="item.title"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
          />
        </div>
      </template>
      <template v-else-if="itemType === 'node'">
        <div class="m-3">
          <el-input
            type="textarea"
            size="large"
            v-model="item.name"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
          />
        </div>
        <div class="m-3">
          <el-input
            type="textarea"
            size="large"
            v-model="item.detail"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
            class="clear-el-style"
          />
        </div>
        <div class="m-3">
          <el-input
            type="textarea"
            size="large"
            v-model="item.record"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
            class="clear-el-style"
          />
        </div>
      </template>
    </el-scrollbar>
    <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
      <el-button :icon="Delete" size="small" @click="" />
    </div>
  </div>
</template>
