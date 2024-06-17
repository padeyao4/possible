<script setup lang="ts">
import { currentProject } from '@/service/project.service'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'
import type { Point } from '@/stores/types'
import { useTempPaths } from '@/stores/temp-path'
import CanvasTheTempPath from '@/components/ProjectViewComponent/CanvasTheTempPath.vue'

const project = currentProject()
const setting = useSettings()
const tempPaths = useTempPaths()

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
  <canvas-the-temp-path v-for="edge in edges" :edge="edge" :key="edge.id"/>
</template>

<style scoped>

</style>