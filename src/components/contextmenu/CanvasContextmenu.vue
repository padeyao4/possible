<script setup lang="ts">
import { addNode, createNodeTemplate, currentProject } from '@/stores/service/project-service'
import { inject, type Ref } from 'vue'
import { useSettings } from '@/stores/settings'
import { useCanvas } from '@/stores/canvas'

const contextmenuRef = inject<Ref<HTMLElement>>('contextmenu')
const canvas = useCanvas()

const settings = useSettings()
const project = currentProject()

function getCanvasPointByClientPoint(x: number, y: number) {
  const { x: cx, y: cy } = canvas.getBoundingClientRect()
  return { x: x - cx - project.offset.x, y: y - cy - project.offset.y }
}

function handleNewNode() {
  const x = contextmenuRef.value.getAttribute('data-x')
  const y = contextmenuRef.value.getAttribute('data-y')
  const { x: cx, y: cy } = getCanvasPointByClientPoint(Number(x), Number(y))
  const node = createNodeTemplate()
  node.x = Math.floor(cx / settings.unitWidth)
  node.y = Math.floor(cy / settings.unitHeight)
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