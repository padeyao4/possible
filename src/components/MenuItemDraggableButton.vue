<!--导航编辑按钮-->
<script setup lang="ts">
import type { Project } from '@/stores';
defineProps<{ project: Project }>();
</script>

<template>
  <div
    class="flex h-6 w-6 items-center justify-center rounded hover:bg-blue-100"
    :data-draggable-move="project.id"
  >
    <span
      class="icon-[icon-park-outline--drag] bg-gray-400"
      style="height: 14px; width: 14px"
      :data-draggable-move="project.id"
    />
  </div>
</template>

<style scoped></style>
