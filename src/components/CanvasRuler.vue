<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { useSettings } from '@/stores/settings'

const settings = useSettings()

const rulers = ref<number[]>([])

const { height } = useWindowSize()

watchEffect(() => {
  const size = Math.ceil(height.value / settings.unitHeight)
  rulers.value = Array.from({ length: size }, (_, i) => i + 1)
})
</script>

<template>
  <div id="canvas-ruler">
    <div v-for="item in rulers" :key="item" :style="{'height':`${settings.unitHeight}px`}">{{ item }}</div>
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
</style>