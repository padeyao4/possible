<script setup lang="ts">
import { ArrowDownBold, ArrowRightBold } from '@element-plus/icons-vue';

defineProps<{
  count: number;
}>();

const visible = defineModel();
</script>

<template>
  <div
    class="flex h-8 w-fit select-none flex-row items-center justify-center rounded-md border border-gray-500 bg-gray-300 px-2"
    @click="visible = !visible"
  >
    <el-icon class="mr-1">
      <ArrowDownBold v-if="visible" />
      <ArrowRightBold v-else />
    </el-icon>
    <div>
      <el-text> 已完成 {{ count }} </el-text>
    </div>
  </div>
</template>
