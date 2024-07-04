<script setup lang="ts">
import { ref } from 'vue';
import { Backlog } from '@/core';
import { Check } from '@element-plus/icons-vue';

const { item } = defineProps<{
  item: Backlog;
}>();

const showIcon = ref(false);
</script>

<template>
  <div
    class="flex h-14 w-full items-center rounded-lg border border-gray-200 hover:bg-blue-100"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="mx-3 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-500"
      @click="item.set({ done: !item.done })"
    >
      <el-icon v-show="item.done" size="16"><Check /></el-icon>
    </div>
    <div class="flex h-full grow">
      <div class="flex items-center overflow-x-hidden">
        <el-text truncated class="overflow-x-hidden"> {{ item.title }} </el-text>
      </div>
    </div>
    <div
      v-show="showIcon"
      class="icon-[icon-park-outline--drag] ml-auto mr-2 block shrink-0 border border-black text-xl"
      data-move
    />
  </div>
</template>
