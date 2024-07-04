<script setup lang="ts">
import { Sunny } from '@element-plus/icons-vue';
import { useCounter } from '@/stores';

const counter = useCounter();
</script>

<template>
  <div
    @click="$router.push({ name: 'today' })"
    class="mx-2.5 flex h-12 flex-row items-center rounded-md hover:bg-blue-100"
  >
    <el-icon class="mx-2" :size="24"><Sunny /></el-icon>
    <el-text class="grow">我的一天</el-text>
    <div class="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <el-text size="small">{{ counter.count }}</el-text>
    </div>
  </div>
</template>

<style scoped></style>
