<!--导航编辑按钮-->
<script setup lang="ts">
import type { Project } from '@/stores';

const props = defineProps<{ project: Project }>();

function handleClick() {
  // todo
  console.log('点击编辑按钮', props.project);
}
</script>

<template>
  <div
    class="flex h-6 w-6 items-center justify-center rounded hover:cursor-pointer hover:bg-blue-100"
    @click="handleClick"
  >
    <span class="icon-[cil--pen] bg-gray-400" style="height: 14px; width: 14px" />
  </div>
</template>

<style scoped></style>
