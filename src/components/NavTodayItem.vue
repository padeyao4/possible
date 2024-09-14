<script setup lang="ts">
import { useProjects } from '@/stores';

const projects = useProjects();
</script>

<template>
  <div
    @click="$router.push({ name: 'today' })"
    :class="[
      'mx-2.5 flex h-12 flex-row items-center rounded-md hover:bg-blue-50',
      { 'bg-blue-50': $route.name === 'today' }
    ]"
  >
    <span class="icon-[solar--sun-broken] mx-2 bg-gray-600 text-2xl" />
    <el-text class="grow">我的一天</el-text>
    <div class="mx-2 flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
      <el-text size="small">{{ projects.todayTodoList.length }}</el-text>
    </div>
  </div>
</template>

<style scoped></style>
