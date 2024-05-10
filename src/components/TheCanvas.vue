<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { computed, ref } from 'vue'
import PoCard from '@/components/CanvasCard.vue'
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'

const svgRef = ref()
const groupRef = ref()

const nodes = computed(() => {
  return currentProject()?.nodeMap.values() ?? []
})
</script>

<template>
  <div id="po-canvas">
    <svg id="svg" ref="svgRef">
      <g id="group" ref="groupRef">
        <po-card v-for="node in nodes" :node="node" :key="node.id" />
      </g>
    </svg>
    <canvas-header />
    <canvas-ruler />
  </div>
</template>

<style scoped>
#po-canvas {
  position: relative;
  width: 100%;
  height: 100%;
  background: #b8823050;
}

#svg {
  background: #79bbff;
  width: 100%;
  height: 100%;
}
</style>