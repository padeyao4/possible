<script setup lang="ts">
import ThePath from '@/components/ThePath.vue'
import CanvasCard from '@/components/CanvasCard.vue'

import { currentProject } from '@/stores/service/project-service'
import { computed, onMounted } from 'vue'
import { Register } from '@/lib/base'
import { DragCanvas } from '@/lib/behavior/drag-canvas'
import { useEventListener } from '@vueuse/core'
import { DragCard } from '@/lib/behavior/drag-card'
import { ResizeCard } from '@/lib/behavior/resize-card'

const project = currentProject()

const register = new Register()

onMounted(() => {
  register.addBehaviors(DragCanvas, DragCard, ResizeCard)
  useEventListener(document, 'mouseup', (e: MouseEvent) => {
    register.onmouseup(e)
  })
})

const translateX = computed(() => {
  return project?.offset.x + 20
})

const translateY = computed(() => {
  return project?.offset.y + 40
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
      <the-path />
      <canvas-card v-for="node in project.nodeMap.values()" :node="node" :key="node.id" />
    </g>
  </svg>
</template>

<style scoped>
#svg {
  width: 100%;
  height: 100%;
}
</style>