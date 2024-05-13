<script setup lang="ts">
import CanvasPaths from '@/components/canvas/CanvasPaths.vue'
import CanvasCards from '@/components/canvas/CanvasCards.vue'

import { currentProject } from '@/stores/service/project-service'
import { computed, onMounted } from 'vue'
import { Register } from '@/lib/base'
import { DragCanvas } from '@/lib/behavior/drag-canvas'
import { useEventListener } from '@vueuse/core'
import { DragCard } from '@/lib/behavior/drag-card'
import { ResizeCard } from '@/lib/behavior/resize-card'
import { useSettings } from '@/stores/settings'

const project = currentProject()
const settings = useSettings()

const register = new Register()

onMounted(() => {
  register.addBehaviors(DragCanvas, DragCard, ResizeCard)
  useEventListener(document, 'mouseup', (e: MouseEvent) => {
    register.onmouseup(e)
  })
})

const translateX = computed(() => {
  return project?.offset.x + settings.offsetX
})

const translateY = computed(() => {
  return project?.offset.y + settings.offsetY
})
</script>

<template>
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
       data-type="canvas"
  >
    <g id="group" :transform="`translate(${translateX},${translateY})`">
      <canvas-paths />
      <canvas-cards />
    </g>
  </svg>
</template>

<style scoped>
#svg {
  width: 100%;
  height: 100%;
}
</style>