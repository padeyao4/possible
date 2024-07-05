<script setup lang="ts">
import { Notebook } from '@element-plus/icons-vue';
import { useBacklogs } from '@/stores';

const backlogs = useBacklogs();
</script>

<template>
  <div
    @click="$router.push({ name: 'backlog' })"
    class="mx-2.5 flex h-12 flex-row items-center rounded-md hover:bg-blue-50"
  >
    <span class="icon-[fluent--task-list-ltr-20-filled] mx-2 bg-gray-600 text-2xl"></span>
    <el-text class="grow">备忘录</el-text>
    <div class="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <el-text size="small">{{ backlogs.todos.length }}</el-text>
    </div>
  </div>
</template>

<style scoped></style>
