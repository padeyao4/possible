<script setup lang="ts">
import { type Node } from '@/stores/state'

defineProps<{ node: Node }>()
</script>

<template>
  <g :transform="`translate(${node.x},${node.y})`" :key="node.id">
    <rect :width="node.width" :height="node.height" rx="8" />
    <text>hello</text>
  </g>
</template>

<style scoped>

</style>