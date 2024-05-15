<script setup lang="ts">
import CanvasHeader from '@/components/canvas/CanvasHeader.vue'
import CanvasRuler from '@/components/canvas/CanvasRuler.vue'
import CanvasGrid from '@/components/canvas/CanvasGrid.vue'
import TheCanvas from '@/components/canvas/TheCanvas.vue'
import NodeEditor from '@/components/canvas/CanvasEditor.vue'
import CanvasContextmenu from '@/components/contextmenu/CanvasContextmenu.vue'

</script>

<template>
  <div class="the-group">
    <canvas-grid />
    <the-canvas />
    <canvas-header />
    <canvas-ruler />
    <node-editor />
    <canvas-contextmenu />
  </div>
</template>

<style scoped>
.the-group {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>