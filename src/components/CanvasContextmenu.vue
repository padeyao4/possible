<script setup lang="ts">
import { addNode, createNodeTemplate, currentProject } from '@/stores/service/project-service'
import { inject, type Ref } from 'vue'
import { useSettings } from '@/stores/settings'

const contextmenuRef = inject<Ref<HTMLElement>>('contextmenu')
const canvasRef = inject<Ref<HTMLElement>>('canvas')

const settings = useSettings()
const project = currentProject()

function getCanvasPointByClientPoint(x: number, y: number) {
  const { x: cx, y: cy } = canvasRef.value.getBoundingClientRect()
  return { x: x - cx - settings.offsetX - project.offset.x, y: y - cy - settings.offsetY - project.offset.y }
}

function handleNewNode() {
  const x = contextmenuRef.value.getAttribute('data-x')
  const y = contextmenuRef.value.getAttribute('data-y')
  const { x: cx, y: cy } = getCanvasPointByClientPoint(x, y)
  const node = createNodeTemplate()
  node.x = Math.round(cx / settings.unitWidth)
  node.y = Math.round(cy / settings.unitHeight)
  addNode(project, node)
}

</script>

<template>
  <div class="canvas-contextmenu-list">
    <div @click="handleNewNode">新建</div>
  </div>
</template>

<style scoped>

</style>