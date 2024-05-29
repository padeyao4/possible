<script setup lang="ts">
import CanvasHeader from '@/components/ProjectViewComponent/CanvasHeader.vue'
import CanvasRuler from '@/components/ProjectViewComponent/CanvasRuler.vue'
import CanvasGrid from '@/components/ProjectViewComponent/CanvasGrid.vue'
import TheCanvas from '@/components/ProjectViewComponent/TheCanvas.vue'
import NodeEditor from '@/components/ProjectViewComponent/CanvasEditor.vue'
import CommonContextmenu from '../common/CommonContextmenu.vue'
</script>

<template>
  <div class="the-group">
    <canvas-grid />
    <the-canvas />
    <canvas-header />
    <canvas-ruler />
    <node-editor />
    <CommonContextmenu />
  </div>
</template>

<style scoped>
.the-group {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
