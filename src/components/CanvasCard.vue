<script setup lang="ts">
import { type Node } from '@/stores/state'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'

const props = defineProps<{ node: Node }>()
const settings = useSettings()

const transform = computed(() => {
  return `translate(${props.node.x * settings.unitWidth},${props.node.y * settings.unitHeight})`
})
</script>

<template>
  <g :transform="transform" :key="node.id">
    <rect
      :width="node.width*settings.unitWidth"
      :height="node.height*settings.unitHeight"
      stroke="#000"
      stroke-width="1"
      fill="#fff"
      rx="8" />
  </g>
</template>

<style scoped>

</style>