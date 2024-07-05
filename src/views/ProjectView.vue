<script setup lang="ts">
import ProjectGroupComponent from '@/components/ProjectViewComponent/ProjectGroupComponent.vue';
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue';
import { computed, provide } from 'vue';
import EditorComponent from '@/components/ProjectViewComponent/EditorComponent.vue';
import { useProjectStore } from '@/stores/project';
import type { ID } from '@/core/types';

const { id } = defineProps<{ id: ID }>();

const projects = useProjectStore();
const project = computed(() => projects.getProject(id));

provide('project', project);
</script>

<template>
  <div class="flex h-screen w-full flex-col">
    <header class="m-3 flex h-10 shrink-0 items-end justify-start text-xl text-gray-500">
      {{ project.name ?? '未命名' }}
    </header>
    <main class="project-group">
      <project-group-component />
      <editor-component class="editor" />
    </main>
    <project-footer class="footer" />
  </div>
</template>

<style scoped>
main {
  flex-grow: 1;
}

.footer {
  flex-shrink: 0;
  height: 48px !important;
  background: transparent !important;
  border-top: 1px solid #00000010;
}

.project-group {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border-top: 1px solid #00000010;
}

.editor {
  overflow-y: auto;
  border-left: #00000010 1px solid;
}
</style>
