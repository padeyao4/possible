<script setup lang="ts">
import { computed } from 'vue';
import { useCursor } from '@/stores/cursor';
import emitter, { BusEvents } from '@/utils/emitter';
import { Backlog } from '@/core';
import { Check } from '@element-plus/icons-vue';
import DraggableIcon from '@/components/icon/DraggableIcon.vue';

const { item } = defineProps<{
  item: Backlog;
}>();

const textDecoration = computed(() => (item.done ? 'line-through' : 'none'));

const cursor = useCursor();

const onClick = (id: string) => {
  emitter.emit(BusEvents['backlog:event'], { id });
};
</script>

<template>
  <div
    class="flex h-14 w-full flex-row items-center rounded-lg border border-gray-200 bg-amber-100"
  >
    <div class="flex h-6 w-6 items-center justify-center rounded-full border border-gray-500">
      <el-icon size="16"><Check /></el-icon>
    </div>
    <el-text truncated>{{ item.title }}</el-text>
    <span class="icon-[icon-park-outline--drag] ml-auto text-xl text-gray-600"></span>
  </div>
</template>
