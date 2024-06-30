<script setup lang="ts">
import CheckButton from '@/components/common/CheckButton.vue';
import { computed } from 'vue';
import DraggableIcon from '@/components/icon/DraggableIcon.vue';
import type { DraggableType } from '@/components/types';
import { useCursor } from '@/stores/cursor';
import emitter, { BusEvents } from '@/utils/emitter';

const { item } = defineProps<{
  item: DraggableType;
}>();

const textDecoration = computed(() => (item.done ? 'line-through' : 'none'));

const cursor = useCursor();

const onClick = (id: string) => {
  emitter.emit(BusEvents['backlog:event'], { id });
};
</script>

<template>
  <div class="backlog-item">
    <check-button :checked="item.done" class="icon-button" @click="item.done = !item.done" />
    <el-text @click="onClick(item.id)" truncated class="text">{{ item.title }}</el-text>
    <draggable-icon
      class="draggable-icon"
      data-move
      @pointerenter="cursor.setWithUnlock('pointer')"
      @pointerleave="cursor.setWithUnlock('default')"
    />
  </div>
</template>

<style scoped>
.backlog-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 58px;
  padding: 0 12px;
  background-color: var(--background-middle-color);
  border-radius: 4px;
}

.icon-button {
  width: 24px;
  height: 24px;
}

.text {
  flex: 1;
  align-content: center;
  height: 100%;
  margin-left: 12px;
  font-size: 16px;
  text-decoration-line: v-bind(textDecoration);
}

.draggable-icon {
  width: 24px;
  height: 24px;
}
</style>
