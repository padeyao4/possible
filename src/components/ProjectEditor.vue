<script setup lang="ts">
import emitter from '@/utils/emitter';
import { Node } from '@/core';
import { onBeforeUnmount, ref } from 'vue';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { Delete } from '@element-plus/icons-vue';
import { useEventListener } from '@vueuse/core';

const visible = defineModel({ default: false });
const node = ref<Node>();

emitter.on('node:open', (e) => {
  node.value = e;
  visible.value = true;
});

emitter.on('node:close', () => {
  visible.value = false;
});

onBeforeUnmount(() => {
  emitter.off('node:open');
  emitter.off('node:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    visible.value = false;
  }
});
</script>

<template>
  <div v-if="visible" class="flex h-screen w-80 flex-col border-l border-gray-300">
    <div
      class="drag-region mb-3 flex w-full shrink-0 items-end justify-between"
      style="height: 36px"
    >
      <close-icon-button
        class="no-drag-region ml-2.5 rounded-md border border-gray-300"
        @click="visible = false"
      />
      <div
        class="h-full rounded-bl-lg border border-b border-l border-gray-200"
        style="width: 139px"
      ></div>
    </div>
    <template v-if="node">
      <el-scrollbar class="grow">
        <div class="m-3">
          <el-input
            type="textarea"
            size="large"
            v-model="node.name"
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
            v-model="node.detail"
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
            v-model="node.record"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
            class="clear-el-style"
          />
        </div>
      </el-scrollbar>
      <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-100">
        <el-button :icon="Delete" size="small" @click="" />
      </div>
    </template>
  </div>
</template>
