<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project.service'
import CanvasHeaderItem from '@/components/canvas/CanvasHeaderItem.vue'
import { calculateDaysBetweenDates, useTimer } from '@/stores/timer'

const settings = useSettings()
const indexes = ref<number[]>([])
const project = currentProject()
const timer = useTimer()

const { width } = useWindowSize()

watchEffect(() => {
  const size = Math.ceil(width.value / settings.unitWidth)
  indexes.value = Array.from({ length: size }, (_, i) => i + 1)
})

const x = computed(() => Math.floor(-project.offset.x / settings.unitWidth) - 2)

const translateX = computed(
  () => (project.offset.x % settings.unitWidth) - settings.unitWidth + 'px'
)

const unitWidth = computed(() => settings.unitWidth + 'px')

const todayIndex = computed(() => calculateDaysBetweenDates(timer.timestamp, project.createTime))
</script>

<template>
  <div class="canvas-header border-bottom-shadow">
    <div class="container">
      <div v-for="idx in indexes" class="item" :key="idx">
        <canvas-header-item :idx="idx + x" :isToday="todayIndex === idx + x" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-header {
  position: absolute;
  display: flex;
  flex-direction: row;
  top: 0;
  left: 0;
  right: 0;
  height: 39px;
  overflow-x: hidden;
  background-color: transparent;
  pointer-events: none;
  clip-path: polygon(40px 0, 100% 0, 100% 40px, 40px 40px);
}

.container {
  display: flex;
  flex-direction: row;
  transform: translateX(v-bind(translateX));
  margin-left: 40px;
  width: calc(100% - 40px);
}

.item {
  flex-shrink: 0;
  width: v-bind(unitWidth);
}
</style>
