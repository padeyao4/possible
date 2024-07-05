<script setup lang="ts">
import emitter from '@/utils/emitter';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useBacklogs } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import type { ID } from '@/core/types';

const visible = defineModel({ default: false });

const backlogs = useBacklogs();
const backlogId = ref<string>('');

const item = computed(() => {
  return backlogs.get(backlogId.value);
});

defineExpose({ current: item });

const show = computed(() => {
  return item.value && !item.value.delete && backlogId.value !== '';
});

emitter.on('backlog:open', (e) => {
  visible.value = true;
  backlogId.value = e.id;
});

emitter.on('backlog:close', () => {
  visible.value = false;
});

onBeforeUnmount(() => {
  emitter.off('backlog:open');
  emitter.off('backlog:close');
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    visible.value = false;
  }
});

const onDelete = (id: ID) => {
  backlogs.remove(id);
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
            v-model="item.title"
            autosize
            resize="none"
            placeholder="请输入内容"
            input-style="padding: 16px;"
          />
        </div>
      </el-scrollbar>
      <div class="flex h-12 shrink-0 items-center justify-center border-t border-gray-100">
        <el-button :icon="Delete" size="small" @click="onDelete(item.id)" />
      </div>
    </template>
    <div v-else></div>
  </div>
</template>

<!--max-height="calc( 100vh - 35px - 40px - 48px)"
style="height: calc(100vh - 35px - 40px - 58px)"-->
