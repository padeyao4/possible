<script setup lang="ts">
import type Project from '@/core/Project';

defineProps<{ project: Project }>();
</script>

<template>
  <div class="flex h-12 w-full flex-row rounded-md border border-gray-200 p-1.5">
    <el-text>{{ project.name }}</el-text>
  </div>
</template>

<style scoped></style>
