<script setup>
import { inject, onBeforeUnmount, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { Canvas, Group, Text } from '@antv/g'
import { Renderer } from '@antv/g-canvas'

const graph = inject('graph')
const container = ref()
const canvas = shallowRef()
const group = shallowRef()

function changePosition() {
  const { x } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
  group.value.setPosition(-x, 0)
}

function resize() {
  canvas.value.resize(container.value.clientWidth, container.value.clientHeight)
}

onMounted(() => {
    canvas.value = new Canvas({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      renderer: new Renderer()
    })

    group.value = new Group()

    const text = new Text({
      style: {
        x: 10,
        y: 20,
        text: '这是测试文本This is text',
        fontSize: 14,
        fill: '#000000',
        textBaseline: 'middle',
        wordWrapWidth: 100,
        wordWrap: true,
        lineWidth: 5
      }
    })

    group.value.appendChild(text)

    canvas.value.appendChild(group.value)

    watchEffect(() => {
      graph.value?.on('viewportchange', changePosition)
    })

    window.addEventListener('resize', resize)
  }
)


onBeforeUnmount(() => {
  graph.value.off('viewportchange', changePosition)
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
  width: calc(100vw - 256px);
}
</style>