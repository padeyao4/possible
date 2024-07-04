<script setup lang="ts">
import type { Project } from '@/core';
import { ref } from 'vue';

defineProps<{ project: Project }>();
const showIcon = ref(false);
</script>

<template>
  <div
    class="flex h-12 w-full flex-row items-center rounded-md border-gray-200 hover:border"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="flex h-full w-full items-center justify-start pl-1.5"
      @click="$router.push({ name: 'project', query: { id: project.id } })"
    >
      <el-text>{{ project.name }}</el-text>
    </div>
    <div class="flex h-full w-fit items-center justify-center" data-move v-show="showIcon">
      <span class="icon-[icon-park-outline--drag] m-1.5 text-xl" data-move />
    </div>
  </div>
</template>

<style scoped></style>
