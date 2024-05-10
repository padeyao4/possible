<script setup lang="ts">
import { currentProject } from '@/stores/service/project-service'
import { computed, onMounted, ref } from 'vue'
import PoCard from '@/components/CanvasCard.vue'
import CanvasHeader from '@/components/CanvasHeader.vue'
import CanvasRuler from '@/components/CanvasRuler.vue'
import CanvasGrid from '@/components/CanvasGrid.vue'
import { Register } from '@/lib/base'

const svgRef = ref()
const groupRef = ref()
const gridRef = ref()
const rulerRef = ref()
const headerRef = ref()

const nodes = computed(() => {
  return currentProject()?.nodeMap.values() ?? []
})

const register = new Register(svgRef, groupRef, gridRef, rulerRef, headerRef)

onMounted(() => {
  register.addBehaviors(...[])
})

</script>

<template>
  <div id="po-canvas"
       @mousedown="register.onmousedown($event)"
       @mouseup="register.onmouseup($event)"
       @mouseout="register.onmouseout($event)"
       @mouseenter="register.onmouseenter($event)"
       @mouseleave="register.onmouseleave($event)"
       @mouseover="register.onmouseover($event)"
       @wheel="register.onwheel($event)"
       @click="register.onclick($event)"
       @mousemove="register.onmousemove($event)">
    <canvas-grid ref="gridRef" />
    <svg id="svg" ref="svgRef">
      <g id="group" ref="groupRef">
        <po-card v-for="node in nodes" :node="node" :key="node.id" />
      </g>
    </svg>
    <canvas-header ref="headerRef" />
    <canvas-ruler ref="rulerRef" />
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