<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { onMounted } from 'vue'
import CanvasCard from '@/components/CanvasCard.vue'
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'
import CanvasGrid from '@/components/CanvasGrid.vue'
import { Register } from '@/lib/base'
import { DragCanvas } from '@/lib/drag-canvas'
import { useEventListener } from '@vueuse/core'
import ThePath from '@/components/ThePath.vue'
import { DragCard } from '@/lib/drag-card'

const project = currentProject()

const register = new Register()

onMounted(() => {
  register.addBehaviors(DragCanvas,DragCard)
  useEventListener(document, 'mouseup', (e: MouseEvent) => {
    register.onmouseup(e)
  })
})
</script>

<template>
  <div id="po-canvas">
    <canvas-grid />
    <svg id="svg"
         @mousedown="register.onmousedown($event)"
         @mouseup="register.onmouseup($event)"
         @mouseout="register.onmouseout($event)"
         @mouseenter="register.onmouseenter($event)"
         @mouseleave="register.onmouseleave($event)"
         @mouseover="register.onmouseover($event)"
         @wheel="register.onwheel($event)"
         @click="register.onclick($event)"
         @mousemove="register.onmousemove($event)"
    >
      <g id="group" :transform="`translate(${project?.offset.x},${project?.offset.y})`">
        <the-path />
        <canvas-card v-for="node in project.nodeMap.values()" :node="node" :key="node.id" />
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