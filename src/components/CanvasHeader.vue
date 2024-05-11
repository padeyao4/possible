<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
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

const translateX = computed(() => {
  return project.offset.x % settings.unitWidth + 20 - settings.unitWidth
})
</script>

<template>
  <div id="canvas-header" class="drop-blur">
    <div id="group" :style="{transform: `translateX(${translateX}px)`}">
      <div v-for="item in timers" class="item" :key="item" :style="{'width':`${settings.unitWidth}px`}">{{ item }}</div>
    </div>
    <div id="no" class="drop-blur"></div>
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
  overflow-x: hidden;
}

#group {
  display: flex;
  flex-direction: row;
}

#no {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 40px;
}

.item {
  flex-shrink: 0;
}
</style>