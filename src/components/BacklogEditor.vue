<script setup lang="ts">
import { emitter } from '@/utils';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount } from 'vue';
import { useBacklogs } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import type { ID } from '@/core/types';
import { Backlog } from '@/core';

const visible = defineModel('visible', { default: false });

const backlog = defineModel<Backlog>('backlog', { default: null });

const backlogs = useBacklogs();

const show = computed(() => {
  return backlog.value && backlog.value.status != 'DELETED';
});

emitter.on('editor-backlog:open', (e) => {
  visible.value = true;
  backlog.value = e as Backlog;
});

emitter.on('editor-backlog:close', () => {
  visible.value = false;
  backlog.value = null;
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
  backlogs.remove(id);
  emitter.emit('backlog:delete', { id });
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
            v-model="backlog.title"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
          />
        </div>
      </el-scrollbar>
      <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-200">
        <el-button :icon="Delete" size="small" @click="onDelete(backlog.id)" />
      </div>
    </template>
    <div v-else></div>
  </div>
</template>
