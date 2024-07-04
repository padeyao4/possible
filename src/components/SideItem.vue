<script setup lang="ts">
import type { Project } from '@/core';
import { ref } from 'vue';
import { useProjectStore } from '@/stores';

const { project } = defineProps<{ project: Project }>();
const showIcon = ref(false);
const projects = useProjectStore();

const submitProject = () => {
  if (project.name.trim() === '') {
    project.name = `无标题项目(${projects.sortProjects.length})`;
  }
  project.editable = false;
};

const handleRef = (e: Element) => {
  setTimeout(() => {
    (<HTMLElement>e)?.focus?.();
  });
};
</script>

<template>
  <input
    class="flex h-12 w-full rounded-md border border-gray-200 pr-1 text-base text-gray-600"
    style="
      :focus {
        border-style: none;
        outline: none;
      }
      padding-left: 4px;
    "
    @keydown.enter="submitProject"
    @blur="submitProject"
    v-model="project.name"
    v-if="project.editable"
    :ref="handleRef"
  />
  <div
    v-else
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
