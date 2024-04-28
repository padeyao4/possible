<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { Canvas, Group, Text } from '@antv/g'
import { Renderer } from '@antv/g-canvas'
import { OFFSET_ORIGIN_POINT, UNIT_H } from '@/configs/constant'

const store = useStore()
const container = ref()
const canvas = shallowRef()
const group = shallowRef()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

function resize() {
  canvas.value.resize(container.value.clientWidth, container.value.clientHeight)
  initTexts()
}

onMounted(() => {
  canvas.value = new Canvas({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    renderer: new Renderer()
  })
  group.value = new Group()
  canvas.value.appendChild(group.value)
  initTexts()
  watchEffect(() => {
    currentProject.data.graph?.on('viewportchange', updateInfo)
  })

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
})

function updateInfo() {
  if (!currentProject.data.graph) return
  const { y } = currentProject.data.graph.getCanvasByViewport(OFFSET_ORIGIN_POINT)
  group.value.setPosition(0, -y % UNIT_H)
  const children = group.value.getChildren()
  const offset = y / UNIT_H
  const delta = offset >= 0 ? Math.floor(offset) : Math.ceil(offset)
  for (let i = 0; i < children.length; i++) {
    const index = +children[i].id + delta
    children[i].style.text = index.toString()
  }
}

function initTexts() {
  group.value.removeChildren()
  const childrenSize = Math.ceil(container.value.clientHeight / UNIT_H) + 1
  for (let i = -1; i < childrenSize; i++) {
    const text = new Text({
      id: i.toString(),
      style: {
        x: 10,
        y: i * UNIT_H,
        text: i.toString(),
        fontSize: 10,
        fill: '#000000',
        textBaseline: 'middle',
        textAlign: 'center',
        wordWrapWidth: 100,
        wordWrap: true,
        lineWidth: 5
      }
    })
    group.value.appendChild(text)
  }
}

</script>

<template>
  <div id="graph-ruler" ref="container"></div>
</template>

<style scoped>
#graph-ruler {
  position: absolute !important;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.1);
  left: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  height: 100%;
}
</style>