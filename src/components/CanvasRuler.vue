<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'
import { currentProject } from '@/stores/service/project-service'

const project = currentProject()
const settings = useSettings()

const rulers = ref<number[]>([])

const { height } = useWindowSize()

watchEffect(() => {
  const size = Math.ceil(height.value / settings.unitHeight)
  rulers.value = Array.from({ length: size }, (_, i) => i + 1)
})

const y = computed(() => {
  const absY = Math.abs(project.offset.y)
  return Math.floor(absY / settings.unitHeight) - 2
})

const translateY = computed(() => {
  return project.offset.y % settings.unitHeight + 40 - settings.unitHeight
})
</script>

<template>
  <div id="canvas-ruler" class="canvas-background-color">
    <div :style="{'transform':`translateY(${translateY}px)`}">
      <div v-for="item in rulers"
           :key="item"
           :style="{'height':`${settings.unitHeight}px`}">{{ item + y }}
      </div>
    </div>
  </div>
</template>

<style scoped>
#canvas-ruler {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 19px;
  overflow-y: hidden;
}
</style>