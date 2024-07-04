<script setup lang="ts">
import type { Project } from '@/core';
import { ref } from 'vue';
import { useProjectStore } from '@/stores';
import emitter from '@/utils/emitter';

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

const handleDelete = () => {
  emitter.emit('project:open', project);
};

const handleEdit = () => {
  project.editable = true;
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
    class="flex h-12 w-full flex-row items-center overflow-hidden rounded-md border-gray-200 hover:bg-blue-100"
    @pointerover="showIcon = true"
    @pointerleave="showIcon = false"
  >
    <div
      class="flex h-full grow items-center justify-start overflow-hidden pl-1.5"
      @click="$router.push({ name: 'project', query: { id: project.id } })"
    >
      <el-text truncated size="default">{{ project.name }}</el-text>
    </div>
    <div
      class="flex h-full w-fit shrink-0 items-center justify-center overflow-hidden"
      v-show="showIcon"
    >
      <div
        class="icon-[uiw--delete] m-1 bg-amber-800 text-base hover:cursor-pointer hover:bg-amber-950"
        @click="handleDelete"
      ></div>
    </div>
    <div
      class="flex h-full w-fit shrink-0 items-center justify-center overflow-hidden"
      v-show="showIcon"
    >
      <div
        class="icon-[cil--pen] m-1 bg-amber-800 text-base hover:cursor-pointer hover:bg-amber-950"
        @click="handleEdit"
      ></div>
    </div>
    <div
      class="flex h-full w-fit shrink-0 items-center justify-center overflow-hidden"
      data-move
      v-show="showIcon"
    >
      <div class="icon-[icon-park-outline--drag] m-1 bg-amber-800 text-base" data-move />
    </div>
  </div>
</template>

<style scoped></style>
