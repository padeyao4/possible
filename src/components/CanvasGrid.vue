<script setup lang="ts">
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project-service'

const settings = useSettings()
const project = currentProject()
</script>

<template>
  <div id="canvas-grid">
    <div
      id="container"
      :style="{'background-size':`${settings.unitWidth}px`,'transform':`translateX(${project.offset.x%settings.unitWidth}px)`}" />
  </div>
</template>

<style scoped>
#canvas-grid {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

#container {
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
    90deg,
    black 0px,
    black 1px,
    transparent 1px,
    transparent 120px
  );
  opacity: 0.1;
}
</style>