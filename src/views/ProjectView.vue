<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import PoCanvas from '@/components/TheCanvas.vue'

const project = currentProject()

</script>

<template>
  <div id="project-view">
    <div id="header">{{ project?.name }}</div>
    <div id="body">
      <po-canvas />
    </div>
    <div id="footer">footer</div>
  </div>
</template>

<style scoped>

#project-view {
  height: 100vh;
}

#header {
  width: 100%;
  height: 64px;
  background: #6f6f6f50;
}

#body {
  height: calc(100vh - 48px - 64px);
  margin: 0 16px;
}

#footer {
  height: 48px;
  background: #b8823050;
  box-shadow: rgba(27, 31, 35, 0.06) 0 -1px 0,
  rgba(255, 255, 255, 0.25) 0 -1px 0 inset;
}
</style>