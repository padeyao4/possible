<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import TheCanvas from '@/components/TheCanvas.vue'

const project = currentProject()

</script>

<template>
  <div class="project-view">
    <div id="header">
      <div id="title">{{ project?.name }}</div>
    </div>
    <div id="body" class="border-top-shadow canvas-background-color">
      <the-canvas />
    </div>
    <div id="footer"></div>
  </div>
</template>

<style scoped>
.project-view {
  display: flex;
  flex-direction: column;
}

#header {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 12px;
  font-size: 20px;
}

#title {
  height: 40px;
  margin-left: 16px;
  display: flex;
  align-items: center;
}

#body {
  flex-grow: 1;
}

#footer {
  height: 48px;
  flex-shrink: 0;
  background: transparent !important;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;
}
</style>