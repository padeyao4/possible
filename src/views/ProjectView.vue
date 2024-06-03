<script setup lang="ts">
import { currentProject } from '@/service/project.service'
import ProjectGroupComponent from '@/components/ProjectViewComponent/ProjectGroupComponent.vue'
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue'
import { computed } from 'vue'
import EditorComponent from '@/components/ProjectViewComponent/EditorComponent.vue'

const project = currentProject()

const projectName = computed(() => project?.name === '' ? '未命名项目' : project.name)
</script>

<template>
  <div class="project-view">
    <header data-tauri-drag-region>
      <div class="title">{{ projectName }}</div>
    </header>
    <main class="project-group">
      <ProjectGroupComponent />
      <EditorComponent class="editor" />
    </main>
    <footer>
      <project-footer />
    </footer>
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
  align-items: center;
  width: 100%;
  padding: 12px 16px;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: var(--font-large-size);
  }
}

main {
  flex-grow: 1;
}

footer {
  flex-shrink: 0;
  height: 48px;
  background: transparent !important;
  border-top: 1px solid #00000010;
}

.project-group {
  display: flex;
  flex-direction: row;
  background-color: var(--background-canvas-color);
  border-top: 1px solid #00000010;
}

.editor {
  overflow-y: auto;
  border-left: #00000010 1px solid;
}
</style>
