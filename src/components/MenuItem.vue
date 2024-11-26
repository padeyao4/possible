<script setup lang="ts">
import { ref } from 'vue';
import { type Project } from '@/stores';

defineProps<{ project: Project }>();
const showIcon = ref(false);
</script>

<template>
  <div
    class="my-1 flex h-12 w-full flex-row items-center overflow-hidden rounded-md border-gray-200 px-1.5 hover:bg-blue-50"
    :class="{ 'bg-blue-50': $route.name === 'project' && $route.query.id === project.id }"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="flex h-full grow items-center justify-start overflow-hidden pl-1.5"
      @click="$router.push({ name: 'project', query: { id: project.id } })"
    >
      <el-text truncated size="default">{{ project.name }}</el-text>
    </div>
    <div v-show="showIcon" class="flex shrink-0 flex-row">
      <div
        class="flex h-6 w-6 items-center justify-center rounded hover:cursor-pointer hover:bg-blue-100"
      >
        <span class="icon-[uiw--delete] text-gray-400" style="height: 14px; width: 14px" />
      </div>
      <div
        class="flex h-6 w-6 items-center justify-center rounded hover:cursor-pointer hover:bg-blue-100"
      >
        <span class="icon-[cil--pen] bg-gray-400" style="height: 14px; width: 14px" />
      </div>
<!--      <div class="flex h-6 w-6 items-center justify-center rounded hover:bg-blue-100">-->
<!--        <div class="icon-[icon-park-outline&#45;&#45;drag] bg-gray-400" />-->
<!--      </div>-->
    </div>
  </div>
</template>
