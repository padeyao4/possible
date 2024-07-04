<script setup lang="ts">
import emitter, { BusEvents } from '@/utils/emitter';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useBacklog } from '@/stores';
import { useEventListener } from '@vueuse/core';
import { Delete } from '@element-plus/icons-vue';
import type { ID } from '@/core/types';

const visible = defineModel();

const backlog = useBacklog();
const backlogId = ref<string>('');

const item = computed(() => {
  return backlog.get(backlogId.value);
});

const show = computed(() => {
  return item.value && !item.value.delete && backlogId.value !== '';
});

emitter.on(BusEvents['backlog:event'], ({ id }: { id: string }) => {
  if (id === backlogId.value || visible.value === false) {
    visible.value = !visible.value;
  }
  backlogId.value = id;
});

defineExpose({ visible: visible });

onBeforeUnmount(() => {
  emitter.off(BusEvents['backlog:event']);
});

useEventListener(window, 'keydown', (e) => {
  if (e.key === 'Escape') {
    visible.value = false;
  }
});

const onDelete = (id: ID) => {
  backlog.remove(id);
};
</script>

<template>
  <div class="h-screen w-80" v-show="visible">
    <div class="mt-9 flex h-10 w-full items-center justify-end border-t border-gray-100">
      <close-icon-button style="margin-left: auto; margin-right: 12px" @click="visible = false" />
    </div>
    <template v-if="show">
      <el-scrollbar
        max-height="calc( 100vh - 35px - 40px - 48px)"
        style="height: calc(100vh - 35px - 40px - 58px)"
      >
        <div style="margin: 0 12px">
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
      <div class="flex h-12 items-center justify-center border-t border-gray-100">
        <el-button :icon="Delete" size="small" @click="onDelete(item.id)" />
      </div>
    </template>
    <div v-else></div>
  </div>
</template>
