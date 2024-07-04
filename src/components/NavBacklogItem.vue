<script setup lang="ts">
import { Notebook } from '@element-plus/icons-vue';
import { useBacklog } from '@/stores';

const backlogs = useBacklog();
</script>

<template>
  <div
    @click="$router.push({ name: 'backlog' })"
    class="mx-1.5 flex h-12 flex-row items-center rounded-md hover:border"
  >
    <el-icon class="mx-2" :size="24"><Notebook /></el-icon>
    <el-text class="grow">备忘录</el-text>
    <div class="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <el-text size="small">{{ backlogs.todos.length }}</el-text>
    </div>
  </div>
</template>

<style scoped></style>
