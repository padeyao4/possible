<script setup lang="ts">
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'
import CanvasGrid from '@/components/CanvasGrid.vue'
import CanvasContent from '@/components/CanvasContent.vue'
</script>

<template>
  <div id="the-canvas">
    <canvas-grid />
    <canvas-content />
    <canvas-header />
    <canvas-ruler />
  </div>
</template>

<style scoped>
#the-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>