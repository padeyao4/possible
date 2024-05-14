<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'
import type { Point } from '@/stores/projects'
import { useCanvasPaths } from '@/stores/canvas-path'

const project = currentProject()
const setting = useSettings()
const tempPaths = useCanvasPaths()

const edges = computed<{ id: string, from: Point, to: Point, opacity: number }[]>(() => {
  const { nodeMap } = project
  const { paths } = tempPaths
  const ans = []
  const { unitWidth, unitHeight } = setting
  for (let path of paths.values()) {
    const node = nodeMap.get(path.nodeId)

    if (path.dummy === 'source') {
      ans.push({
        id: path.id,
        from: path.location,
        opacity: path.opacity,
        to: {
          x: (node.x + node.width) * unitWidth - setting.offsetCardX,
          y: (node.y + node.height / 2) * unitHeight
        }
      })
    } else {
      ans.push({
        id: path.id,
        from: { x: (node.x) * unitWidth + setting.offsetCardX, y: (node.y + node.height / 2) * unitHeight },
        to: path.location,
        opacity: path.opacity
      })
    }
  }
  return ans
})

</script>

<template>
  <path v-for="edge in edges"
        :d="`M ${edge.from.x},${edge.from.y} L ${edge.to.x},${edge.to.y}`"
        stroke="#000"
        :opacity="edge.opacity"
        :data-key="edge.id"
        data-type="path"
        pointer-events="none"
        stroke-opacity="0.7"
        stroke-width="" />
</template>

<style scoped>

</style>