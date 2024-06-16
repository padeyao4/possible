<script setup lang="ts">
import { computed } from 'vue'
import type { Path } from '@/stores/types'

const props = defineProps<{ edge: Path }>()

const disX = computed(() => {
  return Math.abs(props.edge.from.x - props.edge.to.x)
})

const ctl1 = computed(() => {
  return {
    x: props.edge.from.x + disX.value / 2,
    y: props.edge.from.y
  }
})

const ctl2 = computed(() => {
  return {
    x: props.edge.to.x - disX.value / 2,
    y: props.edge.to.y
  }
})
</script>

<template>
  <path
    :d="`M ${edge.from.x},${edge.from.y} C ${ctl1.x},${ctl1.y} ${ctl2.x},${ctl2.y} ${edge.to.x},${edge.to.y}`"
    stroke="#000000"
    fill="#ffffff00"
    :data-key="edge.id"
    data-el-type="edge"
    stroke-opacity="0.3"
    stroke-width="1"
  />
  <path
    :d="`M ${edge.from.x},${edge.from.y} C ${ctl1.x},${ctl1.y} ${ctl2.x},${ctl2.y} ${edge.to.x},${edge.to.y}`"
    stroke="#00000050"
    fill="#ffffff00"
    :data-key="edge.id"
    opacity="0"
    data-mouse-style="pointer"
    data-el-type="edge"
    stroke-opacity="0.7"
    stroke-width="9"
  />
</template>

<style scoped>
path:hover {
  opacity: 1;
}
</style>
