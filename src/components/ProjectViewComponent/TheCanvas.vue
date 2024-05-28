<script setup lang="ts">
import CanvasPaths from '@/components/ProjectViewComponent/CanvasPaths.vue'
import CanvasCards from '@/components/ProjectViewComponent/CanvasCards.vue'

import { currentProject } from '@/service/project.service'
import { computed, onMounted, ref } from 'vue'
import { Register } from '@/lib/base'
import CanvasTempPaths from '@/components/ProjectViewComponent/CanvasTempPaths.vue'
import { useCanvas } from '@/stores/canvas'
import DragCanvas from '@/lib/behavior/drag-canvas'
import { DragCard } from '@/lib/behavior/drag-card'
import { ResizeCard } from '@/lib/behavior/resize-card'
import { DefaultBehavior } from '@/lib/behavior/default'
import { DoubleClickCard } from '@/lib/behavior/double-click-card'
import { CreateEdge } from '@/lib/behavior/create-edge'
import { HandleContextmenu } from '@/lib/behavior/handle-contextmenu'
import WheelCanvas from '@/lib/behavior/wheel-canvas'

const svg = ref()
const canvas = useCanvas()
const project = currentProject()

onMounted(() => {
  canvas.set(svg.value)
  const register = new Register(svg.value, project)
  register.addBehaviors(
    DefaultBehavior,
    DragCanvas,
    DragCard,
    ResizeCard,
    DoubleClickCard,
    CreateEdge,
    HandleContextmenu,
    WheelCanvas
  )
  register.listen()
})

const translateX = computed(() => project?.offset.x)
const translateY = computed(() => project?.offset.y)
</script>

<template>
  <svg ref="svg" @contextmenu.prevent data-el-type="canvas" data-type="canvas">
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
