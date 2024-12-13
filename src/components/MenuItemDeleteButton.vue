<!--导航编辑按钮-->
<script lang="ts" setup>
import { emitter } from '@/utils';
import type { Project } from '@/stores';

defineProps<{ project: Project }>();
</script>

<template>
  <div
    class="flex h-6 w-6 items-center justify-center rounded hover:cursor-pointer hover:bg-blue-100"
    @click="emitter.emit('open-delete-project-dialog', project)"
  >
    <span class="icon-[uiw--delete] text-gray-400" style="height: 14px; width: 14px" />
  </div>
</template>

<style scoped></style>
