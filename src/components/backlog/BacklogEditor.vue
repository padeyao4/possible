<script setup lang="ts">
import emitter, { BusEvents } from '@/utils/emitter';
import CloseIconButton from '@/components/common/CloseIconButton.vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import { useBacklog } from '@/stores';
import { useEventListener } from '@vueuse/core';

const visible = defineModel();

const backlog = useBacklog();
const backlogId = ref<string>('');

const item = computed(() => {
  return backlog.get(backlogId.value);
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
</script>

<template>
  <div class="right" v-show="visible">
    <div style="margin-top: 35px; border-top: 1px solid #00000015">
      <close-icon-button style="margin-left: auto" @click="visible = false" />
    </div>
    <div>
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
  </div>
</template>

<style scoped>
.right {
  display: grid;
  grid-auto-rows: min-content;
  gap: 4px;
  width: 300px;
  min-width: 300px !important;
  height: 100vh;
  background-color: var(--background-middle-color);
  border-right: solid 1px #00000030;
  & > * {
    margin: 0 8px;
  }
  & > *:first-child {
    margin: 0;
    padding: 10px;
  }
}
</style>
