<script setup lang="ts">
import CanvasPaths from '@/components/canvas/CanvasPaths.vue'
import CanvasCards from '@/components/canvas/CanvasCards.vue'

import { currentProject } from '@/stores/service/project-service'
import { computed, onMounted, ref } from 'vue'
import { Register } from '@/lib/base'
import { DragCanvas } from '@/lib/behavior/drag-canvas'
import { useEventListener } from '@vueuse/core'
import { DragCard } from '@/lib/behavior/drag-card'
import { ResizeCard } from '@/lib/behavior/resize-card'
import { DoubleClickCard } from '@/lib/behavior/double-click-card'
import { CreateEdge } from '@/lib/behavior/create-edge'
import CanvasTempPaths from '@/components/canvas/CanvasTempPaths.vue'
import { useCanvas } from '@/stores/canvas'

const svg = ref()
const canvas = useCanvas()
const project = currentProject()

const register = new Register()

onMounted(() => {
  canvas.set(svg.value)
  register.addBehaviors(DragCanvas, DragCard, ResizeCard, DoubleClickCard, CreateEdge)
  useEventListener(document, 'mouseup', (e: MouseEvent) => {
    register.onmouseup(e)
  })
})

const translateX = computed(() => project?.offset.x)

const translateY = computed(() => project?.offset.y)

</script>

<template>
  <svg
    @mousedown="register.onmousedown($event)"
    @mouseup="register.onmouseup($event)"
    @mouseout="register.onmouseout($event)"
    @mouseenter="register.onmouseenter($event)"
    @mouseleave="register.onmouseleave($event)"
    @mouseover="register.onmouseover($event)"
    @wheel="register.onwheel($event)"
    @click="register.onclick($event)"
    @dblclick="register.ondblclick($event)"
    @mousemove="register.onmousemove($event)"
    ref="svg"
    data-type="canvas"
  >
    <g :transform="`translate(${translateX},${translateY})`">
      <canvas-paths />
      <canvas-cards />
      <canvas-temp-paths />
    </g>
  </svg>
</template>

<style scoped>
svg {
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  margin-left: 40px;
  margin-top: 40px;
}
</style>