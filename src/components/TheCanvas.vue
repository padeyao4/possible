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
    <div id="block" class="canvas-background-color"></div>
  </div>
</template>

<style scoped>
#the-canvas {
  position: relative;
  width: 100%;
  height: 100%;
}

#block {
  position: absolute;
  top: 0;
  left: 0;
  width: 21px;
  height: 40px;
}
</style>