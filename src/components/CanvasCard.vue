<script setup lang="ts">
import { type Node } from '@/stores/state'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'

const props = defineProps<{ node: Node }>()
const settings = useSettings()

const transform = computed(() => {
  return `translate(${props.node.x * settings.unitWidth},${props.node.y * settings.unitHeight})`
})

const width = computed(() => {
  return props.node.width * settings.unitWidth
})

const height = computed(() => {
  return props.node.height * settings.unitHeight
})
</script>

<template>
  <g :transform="transform">
    <rect
      :width="width"
      :height="height"
      stroke="#000"
      :data-key="node.id"
      data-main
      stroke-width="1"
      fill="#fff"
      rx="8" />
    <g opacity="0">
      <rect :data-key="node.id" data-direction="lt" x="0" y="0" width="5" height="5" />
      <rect :data-key="node.id" data-direction="rt" :x="width-5" y="0" width="5" height="5" />
      <rect :data-key="node.id" data-direction="t" x="5" y="0" :width="width-10" height="5" />
      <rect :data-key="node.id" data-direction="b" x="5" :y="height-5" :width="width-10" height="5" />
      <rect :data-key="node.id" data-direction="l" x="0" y="5" :width="5" :height="height-10" />
      <rect :data-key="node.id" data-direction="r" :x="width-5" y="5" :width="5" :height="height-10" />
      <rect :data-key="node.id" data-direction="lb" x="0" :y="height-5" width="5" height="5" />
      <rect :data-key="node.id" data-direction="rb" :x="width-5" :y="height-5" width="5" height="5" />
    </g>
  </g>
</template>

<style scoped>

</style>