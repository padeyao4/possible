<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project-service'
import CanvasHeaderItem from '@/components/canvas/CanvasHeaderItem.vue'
import { calculateDaysBetweenDates, days, useTimer } from '@/stores/timer'

const settings = useSettings()
const indexes = ref<number[]>([])
const project = currentProject()
const timer = useTimer()

const { width } = useWindowSize()

watchEffect(() => {
  const size = Math.ceil(width.value / settings.unitWidth)
  indexes.value = Array.from({ length: size }, (_, i) => i + 1)
})

const x = computed(() => {
  return Math.floor(-project.offset.x / settings.unitWidth) - 2
})

const translateX = computed(() => {
  return project.offset.x % settings.unitWidth + settings.offsetX - settings.unitWidth
})

const todayIndex = computed(() => {
  return calculateDaysBetweenDates(timer.timestamp, project.createTime)
})

</script>

<template>
  <div id="canvas-header" class="canvas-background-color border-bottom-shadow">
    <div id="group" :style="{'transform': `translateX(${translateX}px)`}">
      <div v-for="idx in indexes" class="item" :key="idx" :style="{'width':`${settings.unitWidth}px`}">
        <canvas-header-item :idx="idx + x " :isToday=" todayIndex === idx+x" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#canvas-header {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  right: 0;
  height: 39px;
  overflow-x: hidden;
  pointer-events: none;
}

#group {
  display: flex;
  flex-direction: row;
}

.item {
  flex-shrink: 0;
}
</style>