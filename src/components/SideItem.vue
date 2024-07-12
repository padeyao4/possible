<script setup lang="ts">
import type { Project } from '@/core';
import { ref } from 'vue';
import { useProjects } from '@/stores';
import { emitter } from '@/utils';

const { project } = defineProps<{ project: Project }>();
const showIcon = ref(false);
const projects = useProjects();

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

const handleDelete = () => {
  emitter.emit('project-dialog:open', project);
};

const handleEdit = () => {
  project.editable = true;
};
</script>

<template>
  <input
    class="flex h-12 w-full rounded-md border border-gray-200 pr-1 text-base text-gray-500"
    :class="{ 'bg-blue-50': $route.name === 'project' && $route.query.id === project.id }"
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
    class="flex h-12 w-full flex-row items-center overflow-hidden rounded-md border-gray-200 hover:bg-blue-50"
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
        <span
          class="icon-[uiw--delete] text-gray-400"
          style="height: 14px; width: 14px"
          @click="handleDelete"
        />
      </div>
      <div
        class="flex h-6 w-6 items-center justify-center rounded hover:cursor-pointer hover:bg-blue-100"
      >
        <span
          class="icon-[cil--pen] bg-gray-400"
          style="height: 14px; width: 14px"
          @click="handleEdit"
        />
      </div>
      <div class="flex h-6 w-6 items-center justify-center rounded hover:bg-blue-100" data-move>
        <div class="icon-[icon-park-outline--drag] bg-gray-400" data-move />
      </div>
    </div>
  </div>
</template>
