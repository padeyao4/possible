<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'
import type { Path } from '@/stores/projects'
import CanvasThePath from '@/components/canvas/CanvasThePath.vue'

const project = currentProject()
const setting = useSettings()

const edges = computed<Path[]>(() => {
  const { nodeMap, edgeMap } = project
  const ans = []
  const { unitWidth, unitHeight } = setting
  for (let edge of edgeMap.values()) {
    const sourceNode = nodeMap.get(edge.source)
    const sx = (sourceNode.x + sourceNode.width) * unitWidth - setting.offsetCardX
    const sy = (sourceNode.y + sourceNode.height / 2) * unitHeight

    const targetNode = nodeMap.get(edge.target)
    const tx = (targetNode.x) * unitWidth + setting.offsetCardX
    const ty = (targetNode.y + targetNode.height / 2) * unitHeight

    ans.push({
      id: edge.id,
      from: { x: sx, y: sy },
      to: { x: tx, y: ty }
    })
  }
  return ans
})

</script>

<template>
  <canvas-the-path v-for="edge in edges" :edge="edge" :key="edge.id" />
</template>

<style scoped></style>