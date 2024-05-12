<script setup lang="ts">
import { type Node } from '@/stores/state'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'

const props = defineProps<{ node: Node }>()
const settings = useSettings()

const translateX = computed(() => {
  return props.node.x * settings.unitWidth
})

const translateY = computed(() => {
  return props.node.y * settings.unitHeight
})

const width = computed(() => {
  return props.node.width * settings.unitWidth
})

const height = computed(() => {
  return props.node.height * settings.unitHeight
})
</script>

<template>
  <g :transform="`translate(${translateX},${translateY})`">
    <rect
      :width="width"
      :height="height"
      opacity="0.8"
      stroke-width="1"
      stroke="#000"
      fill="#fff"
      rx="8" />
    <foreignObject :width="width" :height="height">
      <div id="text">
        <p id="content">
         {{ node.name}}
        </p>
      </div>
    </foreignObject>
    <rect
      :width="width"
      :height="height"
      opacity="0"
      :data-key="node.id"
      data-type="node"
      data-main
      rx="8" />
    <g opacity="0">
      <rect :data-key="node.id" data-type="node" data-direction="lt" x="0" y="0" width="5" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="rt" :x="width-5" y="0" width="5" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="t" x="5" y="0" :width="width-10" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="b" x="5" :y="height-5" :width="width-10" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="l" x="0" y="5" :width="5" :height="height-10" />
      <rect :data-key="node.id" data-type="node" data-direction="r" :x="width-5" y="5" :width="5" :height="height-10" />
      <rect :data-key="node.id" data-type="node" data-direction="lb" x="0" :y="height-5" width="5" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="rb" :x="width-5" :y="height-5" width="5" height="5" />
    </g>
  </g>
</template>

<style scoped>
#text {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 10px;
  overflow: hidden;
}

#content {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 100;
  font-size: 13px;
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>