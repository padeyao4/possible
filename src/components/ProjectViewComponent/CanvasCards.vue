<script setup lang="ts">
import CanvasCardItem from '@/components/ProjectViewComponent/CanvasCardItem.vue'
import { isCross } from '@/lib/math'
import { currentProject } from '@/service/project.service'
import { useSettings } from '@/stores/settings'
import { useWindowSize } from '@vueuse/core'
import { computed, watch } from 'vue'

const settings = useSettings()
const project = currentProject()

const { width: windowWidth, height: windowHeight } = useWindowSize()

const rect = computed(() => {
  const x = -project.offset.x / settings.unitWidth
  const width = windowWidth.value / settings.unitWidth
  const y = -project.offset.y / settings.unitHeight
  const height = windowHeight.value / settings.unitHeight
  return {
    x,
    y,
    width,
    height
  }
})

const nodes = computed(() => {
  return Array.from(project.nodeMap.values()).filter((node) => isCross(rect.value, node))
})

watch(nodes, () => {
  console.log(nodes.value.length)
})
</script>

<template>
  <canvas-card-item v-for="node in nodes" :node="node" :key="node.id" />
</template>

<style scoped></style>
