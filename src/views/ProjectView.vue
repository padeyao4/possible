<script setup lang="ts">
import ProjectGroupComponent from '@/components/ProjectViewComponent/ProjectGroupComponent.vue';
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue';
import { provide } from 'vue';
import EditorComponent from '@/components/ProjectViewComponent/EditorComponent.vue';
import { useProjectStore } from '@/stores/project';
import type { ID } from '@/core/types';

const { id } = defineProps<{ id: ID }>();

const store = useProjectStore();
const project = store.getProject(id);

provide('project', project);
</script>

<template>
  <div class="project-view">
    <header>
      <div class="title">{{ project.name ?? '未命名' }}</div>
    </header>
    <main class="project-group">
      <project-group-component />
      <editor-component class="editor" />
    </main>
    <project-footer class="footer" />
  </div>
</template>

<style scoped>
.project-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  height: 40px;
  margin: 12px 16px;

  .title {
    display: block;
    overflow: hidden;
    font-size: var(--font-large-size);
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

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
  background-color: var(--background-canvas-color);
  border-top: 1px solid #00000010;
}

.editor {
  overflow-y: auto;
  border-left: #00000010 1px solid;
}
</style>
