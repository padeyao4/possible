<script setup lang="ts">
import { emitter } from '@/utils';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount } from 'vue';
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import type { ID } from '@/core/types';
import { Node } from '@/core';

const visible = defineModel<boolean>('visible', { default: false });

const node = defineModel<Partial<Node>>('node', { default: null });

const show = computed(() => {
  return node.value && node.value.status != 'DELETED';
});

emitter.on('editor-node:open', (e) => {
  visible.value = true;
  node.value = e;
});

emitter.on('editor-backlog:close', () => {
  visible.value = false;
});

onBeforeUnmount(() => {
  emitter.off('editor-backlog:open');
  emitter.off('editor-backlog:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    visible.value = false;
  }
});

const onDelete = (id: ID) => {
  //todo
};
</script>

<template>
  <div class="flex h-screen w-80 flex-col" v-show="visible">
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
    <template v-if="show">
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
      </el-scrollbar>
      <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
        <el-button :icon="Delete" size="small" @click="" />
      </div>
    </template>
    <div v-else></div>
  </div>
</template>
