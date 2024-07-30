<script setup lang="ts">
import { ArrowDownBold, ArrowRightBold } from '@element-plus/icons-vue';

defineProps<{
  count: number;
}>();

const visible = defineModel({ default: false });
</script>

<template>
  <div
    class="flex h-8 w-fit select-none flex-row items-center justify-center rounded-md border-white bg-white px-2"
    @click="visible = !visible"
  >
    <el-icon class="mr-1 shrink-0">
      <ArrowDownBold v-if="visible" class="text-gray-500" />
      <ArrowRightBold v-else class="text-gray-500" />
    </el-icon>
    <div class="flex w-fit items-center justify-center overflow-hidden">
      <el-text truncated>已完成 {{ count }} </el-text>
    </div>
  </div>
</template>
