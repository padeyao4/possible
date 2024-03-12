<script setup>
import { inject, onBeforeUnmount, onMounted, ref, shallowRef, watchEffect } from 'vue'
import { Canvas, Group, Text } from '@antv/g'
import { Renderer } from '@antv/g-canvas'

const graph = inject('graph')
const container = ref()
const group = shallowRef()

function changePosition() {
  const { x } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
  group.value.setPosition(-x, 0)
}

onMounted(() => {
    const canvas = new Canvas({
      container: container.value,
      width: 800,
      height: 40,
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

    canvas.appendChild(group.value)

    watchEffect(() => {
      graph.value?.on('viewportchange', changePosition)
    })
  }
)

onBeforeUnmount(() => {
  graph.value.off('viewportchange', changePosition)
})
</script>

<template>
  <main>
    <div id="container" ref="container"></div>
  </main>
</template>

<style scoped>
main {
  width: 800px;
  height: 40px;
  background: beige;
}
</style>