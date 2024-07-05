<script setup lang="ts">
import ProjectGroupComponent from '@/components/ProjectViewComponent/ProjectGroupComponent.vue';
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue';
import { computed, provide } from 'vue';
import { useProjectStore } from '@/stores/project';
import type { ID } from '@/core/types';
import ProjectEditor from '@/components/ProjectEditor.vue';

const { id } = defineProps<{ id: ID }>();

const projects = useProjectStore();
const project = computed(() => projects.getProject(id));

provide('project', project);
</script>

<template>
  <div class="flex h-screen w-full flex-row">
    <div class="flex h-screen grow flex-col">
      <header
        class="drag-region flex h-16 shrink-0 items-end justify-start px-3 pb-3 text-xl text-gray-500"
      >
        {{ project.name ?? '未命名' }}
      </header>
      <main class="flex grow flex-row border-t border-gray-200">
        <project-group-component />
      </main>
      <project-footer class="footer" />
    </div>
    <project-editor />
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
</style>
