<script setup lang="ts">
import CheckButton from '@/components/common/CheckButton.vue';
import { computed } from 'vue';
import DraggableIcon from '@/components/icon/DraggableIcon.vue';
import type { DraggableType } from '@/components/types';
import { useCursor } from '@/stores/cursor';

const { item } = defineProps<{
  item: DraggableType;
}>();

const textDecoration = computed(() => (item.done ? 'line-through' : 'none'));

const cursor = useCursor();
</script>

<template>
  <div class="backlog-item">
    <check-button :checked="item.done" class="icon-button" @click="item.done = !item.done" />
    <div class="text">{{ item.title }}</div>
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
  margin-left: 8px;
  font-size: 16px;
  line-height: 24px;
  text-decoration-line: v-bind(textDecoration);
}

.draggable-icon {
  width: 24px;
  height: 24px;
}
</style>
