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

const translateY = computed(() => project.offset.y % settings.unitHeight - settings.unitHeight + 'px')
</script>

<template>
  <div class="canvas-ruler">
    <div class="container">
      <div v-for="item in rulers"
           :key="item"
           :style="{'height':`${settings.unitHeight}px`}">{{ item + y }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.canvas-ruler {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 40px;
  overflow-y: hidden;
  pointer-events: none;
  padding-left: 16px;
  border-right: 1px solid rgba(27, 31, 35, 0.06);
  background-color: transparent;
  clip-path: polygon(0 40px, 40px 40px, 40px 100%, 0 100%);
}

.container {
  margin-top: 40px;
  transform: translateY(v-bind(translateY));
  height: calc(100% - 40px);
}
</style>