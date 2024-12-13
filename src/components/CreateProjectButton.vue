<script setup lang="ts">
import { emitter } from '@/utils';

/**
 * 点击创建项目按钮
 */
function click() {
  emitter.emit('open-create-project-dialog');
}
</script>

<template>
  <div
    class="flex h-full grow flex-row items-center justify-start rounded-md border-gray-200 hover:bg-blue-50"
    @click="click"
  >
    <span class="icon-[uil--plus] mx-1.5 bg-gray-500 text-2xl" />
    <el-text>新建项目</el-text>
  </div>
</template>
