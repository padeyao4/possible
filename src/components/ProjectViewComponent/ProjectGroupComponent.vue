<script setup lang="ts">
import { provide, ref } from 'vue';
import CanvasHeader from '@/components/ProjectViewComponent/CanvasHeader.vue';
import CanvasRuler from '@/components/ProjectViewComponent/CanvasRuler.vue';
import CanvasGrid from '@/components/ProjectViewComponent/CanvasGrid.vue';
import TheCanvas from '@/components/ProjectViewComponent/TheCanvas.vue';
import GraphContextmenu from '@/components/ProjectViewComponent/GraphContextmenuGroup.vue';

const canvasContainer = ref();

provide('canvasContainer', canvasContainer);
</script>

<template>
  <div class="the-group" ref="canvasContainer">
    <canvas-grid />
    <the-canvas />
    <canvas-header />
    <canvas-ruler />
    <GraphContextmenu />
  </div>
</template>

<style scoped>
.the-group {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
