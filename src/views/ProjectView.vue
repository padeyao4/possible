<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import { extend, Graph } from '@antv/g6'
import GridPlugin from '@/g6/plugin/grid-plugin'
import CreateNode from '@/g6/behaviors/create-node'
import { CardNode } from '@/g6/node/custom-node'
import { NodeDragend } from '@/g6/behaviors/dragend-node.js'

const container = ref()

const graph = shallowRef()

onMounted(() => {
  graph.value = new (extend(Graph, {
    nodes: { CardNode }, plugins: { GridPlugin },
    behaviors: { CreateNode, NodeDragend }
  }))({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    plugins: ['GridPlugin'],
    modes: {
      default: [{
        type: 'drag-canvas',
        key: 'drag-canvas',
        shouldBegin: (event) => event.button === 0
      }, 'CreateNode', {
        type: 'drag-node',
        key: 'drag-node',
        shouldBegin: (event) => event.button === 0
      }, 'NodeDragend']
    },
    node: (model) => {
      const { id, data } = model
      return {
        id,
        data: {
          ...data,
          type: 'CardNode',
          keyShape: {
            radius: 6,
            width: 80,
            height: 40
          },
          otherShapes: {}
        }
      }
    }
  })
  // 先读取数据，否则graph点击有bug
  graph.value.read({})
})

function handleClick() {
  setTimeout(() => {
    const { x, y } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    graph.value.translate({ dx: x, dy: y })
  })
}

</script>

<template>
  <main>
    <button @click="handleClick">reset</button>
    <div id="container" ref="container"></div>
  </main>
</template>

<style scoped>
main {
  background: aquamarine;
  display: flex;
  flex-direction: column;
}

#container {
  width: 800px;
  height: 600px;
  background: aliceblue;
}
</style>