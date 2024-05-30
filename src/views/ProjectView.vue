<script setup lang="ts">
import { currentProject } from '@/service/project.service'
import ProjectGroupComponent from '@/components/ProjectViewComponent/ProjectGroupComponent.vue'
import ProjectFooter from '@/components/ProjectViewComponent/TheFooter.vue'
import { computed } from 'vue'
import EditorComponent from '@/components/ProjectViewComponent/EditorComponent.vue'

const project = currentProject()

const projectName = computed(() => {
  if (project?.name === undefined || project?.name === null || project?.name === '') {
    return '未命名项目'
  } else {
    return project.name
  }
})
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
  margin-top: 24px;
  margin-bottom: 12px;

  .title {
    display: flex;
    align-items: center;
    height: 40px;
    margin-left: 16px;
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
  background-color: var(--background-middle-color);
  border-top: 1px solid #00000010;
}

.editor {
  border-left: #00000010 1px solid;
}
</style>
