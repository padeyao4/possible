<script setup lang="ts">
import CanvasHeader from '@/components/canvas/CanvasHeader.vue'
import CanvasRuler from '@/components/canvas/CanvasRuler.vue'
import CanvasGrid from '@/components/canvas/CanvasGrid.vue'
import TheCanvas from '@/components/canvas/CanvasContent.vue'
import ProjectContextmenu from '@/components/contextmenu/ProjectContextmenu.vue'
import { provide, ref } from 'vue'
import NodeEditor from '@/components/canvas/CanvasEditor.vue'

const theCanvasRef = ref<HTMLElement>()
provide('canvas', theCanvasRef)

const projectContextmenuRef = ref()

</script>

<template>
  <div class="the-group" @contextmenu.capture="projectContextmenuRef.oncontextmenu" ref="theCanvasRef">
    <canvas-grid />
    <the-canvas />
    <canvas-header />
    <canvas-ruler />
    <node-editor />
    <project-contextmenu ref="projectContextmenuRef" />
  </div>
</template>

<style scoped>
.the-group {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>