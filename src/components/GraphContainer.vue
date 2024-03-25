<script setup lang="ts">
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { extend } from '@antv/g6'
import { CustomGraph } from '@/g6/core/graph'
import CardNode from '@/g6/node/custom-node'
import GridPlugin from '@/g6/plugin/grid-plugin'
import CreateNode from '@/g6/behaviors/create-node'
import { DragCanvas } from '@/g6/behaviors/drag-canvas'
import DragNode from '@/g6/behaviors/drag-node'
import CreateEdge from '@/g6/behaviors/create-edge'
import { HoverNode } from '@/g6/behaviors/hover-node'
import DoubleClickNode from '@/g6/behaviors/double-click-node'
import ContextMenu from '@/g6/behaviors/context-menu'
import { dateToX } from '@/utils/time'
import { OFFSET_X } from '@/configs/constant'

const container = ref()
const store = useStore()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

async function resize() {
  const graph = currentProject.data.graph
  const { x: x1, y: y1 } = graph.getCanvasByViewport({ x: 0, y: 0 })
  graph.setSize([container.value.clientWidth, container.value.clientHeight])
  const { x: x2, y: y2 } = graph.getCanvasByViewport({ x: 0, y: 0 })
  await graph.translate({ dx: x2 - x1, dy: y2 - y1 })
}

onMounted(() => {
  const ExtGraph = extend(CustomGraph, {
    nodes: { CardNode },
    plugins: { GridPlugin },
    behaviors: { CreateNode, DragCanvas, DragNode, CreateEdge, HoverNode, DoubleClickNode, ContextMenu }
  })

  const graph = new ExtGraph({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    plugins: ['GridPlugin'],
    modes: {
      default: ['DragCanvas', 'CreateNode', 'DragNode', 'CreateEdge', 'HoverNode', 'DoubleClickNode', 'ContextMenu']
    },
    node: (model) => {
      const { id, data } = model
      return {
        id,
        data: {
          type: 'CardNode',
          anchorPoints: [[0, 0.5], [1, 0.5]],
          keyShape: {
            radius: 4, width: 80, height: 40,
            fill: data.completed ? '#00000030' : '#fff',
            fillOpacity: 0.5,
            stroke: '#000',
            strokeOpacity: 0.5,
            lineWidth: 1
          },
          otherShapes: {},
          anchorShapes: [
            {
              opacity: 0
            },
            {
              opacity: 0
            }
          ],
          ...data
        }
      } as any
    },
    nodeState: {
      hover: {
        anchorShapes: [
          {
            position: [0, 0.5],
            r: 4,
            fill: '#fff',
            cursor: 'pointer',
            opacity: 1
          },
          {
            position: [1, 0.5],
            r: 4,
            fill: '#fff',
            cursor: 'pointer',
            opacity: 1
          }
        ]
      }
    },
    data: {
      nodes: [...currentProject.nodesMap.values()],
      edges: [...currentProject.edgesMap.values()]
    }
  }) as any

  translateToToday(graph)
  currentProject.data.graph = graph

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  currentProject.data.graph = null
})

function translateToToday(graph: CustomGraph) {
  const { x, y } = graph.getCanvasByViewport({ x: 0, y: 0 })
  const currentX = dateToX(store.currentTime, currentProject.createTime)
  graph.translate({ dx: x - currentX + OFFSET_X, dy: y }).then(console.log)
}
</script>

<template>
  <div id="graph-container" ref="container"></div>
</template>

<style scoped>
#graph-container {
  width: calc(100vw - 24px * 2 - 240px);
}
</style>