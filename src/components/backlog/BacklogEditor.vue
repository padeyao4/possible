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
  <div class="right" v-show="visible">
    <div
      style="
        margin-top: 35px;
        border-top: 1px solid #00000015;
        height: 40px;
        display: flex;
        align-items: center;
      "
    >
      <close-icon-button style="margin-left: auto; margin-right: 12px" @click="visible = false" />
    </div>
    <template v-if="show">
      <el-scrollbar
        max-height="calc( 100vh - 35px - 40px - 58px)"
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
      <div class="footer">
        <el-button :icon="Delete" size="small" @click="onDelete(item.id)" />
      </div>
    </template>
    <div v-else></div>
  </div>
</template>

<style scoped>
.right {
  display: grid;
  grid-auto-rows: min-content;
  gap: 4px;
  width: 300px !important;
  min-width: 300px !important;
  height: 100vh;
  background-color: var(--background-middle-color);
  border-right: solid 1px #00000030;
}
.footer {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  border-top: 1px solid #00000015;
}
</style>
