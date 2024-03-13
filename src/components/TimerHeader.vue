<script setup>
import { inject, onBeforeUnmount, onMounted, ref, shallowRef, watch, watchEffect } from 'vue'
import { Canvas, Group, Text } from '@antv/g'
import { Renderer } from '@antv/g-canvas'

const graph = inject('graph')
const container = ref()
const canvas = shallowRef()
const group = shallowRef()

watch(group, () => {
  updateInfo()
})

function updateInfo() {
  if (!graph.value) return
  const { x } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
  group.value.setPosition(-x % 120, 0)
  const children = group.value.getChildren()
  const offset = x / 120
  const delta = offset >= 0 ? Math.floor(offset) : Math.ceil(offset)
  for (let i = 0; i < children.length; i++) {
    const index = children[i].id
    children[i].style.text = (index + delta).toString()
  }
}

function resize() {
  canvas.value.resize(container.value.clientWidth, container.value.clientHeight)
  initTexts()
}

function initTexts() {
  group.value.removeChildren()
  const childrenSize = Math.ceil(container.value.clientWidth / 120) + 1
  for (let i = -1; i < childrenSize; i++) {
    const text = new Text({
      id: i,
      style: {
        x: i * 120,
        y: 20,
        text: '',
        fontSize: 14,
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
  updateInfo()
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
      graph.value?.on('viewportchange', updateInfo)
    })

    window.addEventListener('resize', resize)
  }
)

onBeforeUnmount(() => {
  graph.value.off('viewportchange', updateInfo)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <div>
    <div id="container" ref="container"></div>
  </div>
</template>

<style scoped>
#container {
  height: 40px;
  width: calc(100vw - 240px - 24px * 2);
}
</style>