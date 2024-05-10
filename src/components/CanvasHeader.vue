<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project-service'

const settings = useSettings()
const timers = ref<number[]>([])
const project = currentProject()

const { width } = useWindowSize()

watchEffect(() => {
  const size = Math.ceil(width.value / settings.unitWidth)
  timers.value = Array.from({ length: size }, (_, i) => i + 1)
})
</script>

<template>
  <div id="canvas-header">
    <div id="group" :style="{transform: `translateX(${project.offset.x%settings.unitWidth}px)`}">
      <div v-for="item in timers" class="item" :key="item" :style="{'width':`${settings.unitWidth}px`}">{{ item }}</div>
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
  height: 40px;
  background: #95d475;
  overflow-x: hidden;
}

#group {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  background: #b8823040;
}

.item {
  flex-shrink: 0;
}
</style>