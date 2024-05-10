<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { onMounted, ref } from 'vue'
import PoCard from '@/components/CanvasCard.vue'
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'
import CanvasGrid from '@/components/CanvasGrid.vue'
import { Register } from '@/lib/base'
import { DragCanvas } from '@/lib/drag-canvas'

const project = currentProject()

const register = new Register()

onMounted(() => {
  register.addBehaviors(DragCanvas)
})

//
</script>

<template>
  <div id="po-canvas"
       @mousedown="register.onmousedown($event)"
       @mouseup="register.onmouseup($event)"
       @mouseout="register.onmouseout($event)"
       @mouseenter="register.onmouseenter($event)"
       @mouseleave="register.onmouseleave($event)"
       @mouseover="register.onmouseover($event)"
       @wheel="register.onwheel($event)"
       @click="register.onclick($event)"
       @mousemove="register.onmousemove($event)">
    <canvas-grid />
    <svg id="svg">
      <g id="group" :transform="`translate(${project?.offset.x},${project?.offset.y})`">
        <po-card v-for="node in project.nodeMap.values()" :node="node" :key="node.id" />
      </g>
    </svg>
    <canvas-header />
    <canvas-ruler />
  </div>
</template>

<style scoped>
#po-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: #b8823050;
}

#svg {
  background: #79bbff;
  width: 100%;
  height: 100%;
}
</style>