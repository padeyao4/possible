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

const dyStyle = computed(() => {
  return {
    transform: `translateY(${project.offset.y % settings.unitHeight}px)`
  }
})
</script>

<template>
  <div id="canvas-ruler">
    <div id="group" :style="dyStyle">
      <div v-for="item in rulers"
           :key="item"
           :style="{'height':`${settings.unitHeight}px`}">{{ item }}
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
  width: 20px;
  overflow-y: hidden;
  background: #6f6f6f;
}

#group {
  background: #529b2e40;
  height: 100%;
  width: 100%;
}
</style>