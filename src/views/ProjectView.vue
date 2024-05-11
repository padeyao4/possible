<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import TheCanvas from '@/components/TheCanvas.vue'

const project = currentProject()

</script>

<template>
  <div id="project-view">
    <div id="header">{{ project?.name }}</div>
    <div id="body" class="border-top-shadow canvas-background-color">
      <the-canvas />
    </div>
    <div id="footer"></div>
  </div>
</template>

<style scoped>

#project-view {
  height: 100vh;
}

#header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  padding: 24px 16px;
  font-size: 20px;
}

#body {
  height: calc(100vh - 48px - 64px);
  padding: 0 16px;
}

#footer {
  height: 48px;
  background: transparent !important;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;
}
</style>