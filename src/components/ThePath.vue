<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'

const project = currentProject()
const setting = useSettings()

const edges = computed(() => {
  const { nodeMap, edgeMap } = project
  const ans = []
  const { unitWidth, unitHeight } = setting
  for (let edge of edgeMap.values()) {
    const sourceNode = nodeMap.get(edge.source)
    const sx = (sourceNode.x + sourceNode.width) * unitWidth
    const sy = (sourceNode.y + sourceNode.height / 2) * unitHeight

    const targetNode = nodeMap.get(edge.target)
    const tx = (targetNode.x) * unitWidth
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
  <path v-for="edge in edges"
        :d="`M ${edge.from.x},${edge.from.y} L ${edge.to.x},${edge.to.y}`"
        stroke="#000"
        stroke-opacity="0.7"
        stroke-width="" />
</template>

<style scoped>

</style>