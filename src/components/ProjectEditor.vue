<script setup lang="ts">
import { emitter } from '@/utils';
import { Node, Project } from '@/core';
import { inject, onBeforeUnmount, type Ref, ref } from 'vue';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { Delete } from '@element-plus/icons-vue';
import { useEventListener } from '@vueuse/core';

const visible = defineModel({ default: false });
const node = ref<Partial<Node>>();
const project = inject<Ref<Project>>('project');

emitter.on('editor-node:open', (e) => {
  if (node.value && e.id === node.value.id && visible.value) {
    visible.value = false;
  } else {
    node.value = e;
    visible.value = true;
  }
});

emitter.on('editor-node:close', () => {
  visible.value = false;
});

onBeforeUnmount(() => {
  emitter.off('editor-node:open');
  emitter.off('editor-node:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    visible.value = false;
  }
});

function handleDeleteButton() {
  project.value.removeNode(node.value.id);
  emitter.emit('node:delete', { id: node.value.id });
  node.value = null;
}
</script>

<template>
  <div v-if="visible" class="flex h-screen w-80 flex-col border-l border-gray-200 bg-white">
    <header
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
    </header>
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
      <footer class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
        <el-button :icon="Delete" size="small" @click="handleDeleteButton" />
      </footer>
    </template>
  </div>
</template>
