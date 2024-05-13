<script setup lang="ts">
import { type Node } from '@/stores/state'
import { computed } from 'vue'
import { useSettings } from '@/stores/settings'

const props = defineProps<{ node: Node }>()
const settings = useSettings()

const translateX = computed(() => {
  return props.node.x * settings.unitWidth + settings.offsetCardX
})

const translateY = computed(() => {
  return props.node.y * settings.unitHeight + settings.offsetCardY
})

const width = computed(() => {
  return props.node.width * settings.unitWidth - settings.offsetCardX * 2
})

const height = computed(() => {
  return props.node.height * settings.unitHeight - settings.offsetCardY * 2
})
</script>

<template>
  <g :transform="`translate(${translateX},${translateY})`">
    <rect
      :width="width"
      :height="height"
      opacity="0.7"
      stroke-width="1"
      stroke="#000"
      fill="#fff"
      rx="8" />
    <foreignObject :width="width" :height="height" opacity="1">
      <div id="text">
        <p id="content">
          {{ node.name }}
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
      <rect :data-key="node.id" data-type="node" data-direction="lt" x="-2.5" y="-2.5" fill="red" width="5"
            height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="rt" :x="width-2.5" y="-2.5" fill="red" width="5"
            height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="t" x="2.5" y="-2.5" :width="width-5" height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="b" x="2.5" :y="height-2.5" :width="width-5"
            height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="l" x="-2.5" y="2.5" :width="5" :height="height-5" />
      <rect :data-key="node.id" data-type="node" data-direction="r" :x="width-2.5" y="2.5" :width="5"
            :height="height-5" />
      <rect :data-key="node.id" data-type="node" data-direction="lb" x="-2.5" :y="height-2.5" fill="red" width="5"
            height="5" />
      <rect :data-key="node.id" data-type="node" data-direction="rb" :x="width-2.5" :y="height-2.5" fill="red" width="5"
            height="5" />
    </g>
    <g>
      <circle :cy="height/2" r="5" stroke="#000" fill="#f0f2f5" stroke-width="0.8" data-type="anchor"
              :data-key="node.id" data-location="left" />
      <circle :cx="width" :cy="height/2" r="5" stroke="#000" fill="#f0f2f5" stroke-width="0.8" data-type="anchor"
              :data-key="node.id" data-location="right" />
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