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
import log from 'loglevel'
import { HoverEdge } from '@/g6/behaviors/hover-edge'

const container = ref()
const store = useStore()
const route = useRoute()
const currentProject = store.projects[route.params.id as string]

async function resize() {
  const graph = currentProject.data.graph
  const { x: x1, y: y1 } = graph.getCanvasByViewport({ x: 0, y: 0 })
  if (isNaN(x1) || isNaN(y1) || container.value.clientWidth <= 1 || container.value.clientHeight <= 1) return
  graph.setSize([container.value.clientWidth, container.value.clientHeight])
  const { x: x2, y: y2 } = graph.getCanvasByViewport({ x: 0, y: 0 })
  await graph.translate({ dx: x2 - x1, dy: y2 - y1 })
}

onMounted(() => {
  const ExtGraph = extend(CustomGraph, {
    nodes: { CardNode },
    plugins: { GridPlugin },
    behaviors: { CreateNode, DragCanvas, DragNode, CreateEdge, HoverNode, DoubleClickNode, ContextMenu, HoverEdge }
  })

  const graph = new ExtGraph({
    container: container.value,
    width: container.value.clientWidth,
    height: container.value.clientHeight,
    plugins: ['GridPlugin'],
    modes: {
      default: ['DragCanvas', 'CreateNode', 'DragNode', 'CreateEdge', 'HoverNode', 'DoubleClickNode', 'ContextMenu', 'HoverEdge']
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
    edge: (model) => {
      const { id, source, target, data } = model
      return {
        id, source, target,
        data: {
          sourceAnchor: 1,
          targetAnchor: 0,
          ...data
        }
      }
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
    edgeState: {
      hover: {
        keyShape: {
          strokeWidth: 2,
          cursor: 'pointer'
        }
      }
    },
    data: {
      nodes: [...currentProject.nodesMap.values()],
      edges: [...currentProject.edgesMap.values()]
    }
  }) as any

  graph.translate({
    dx: -currentProject.offset.x,
    dy: -currentProject.offset.y
  }).then(() => log.debug('graph translate to before location'))

  currentProject.data.graph = graph

  window.addEventListener('resize', resize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  currentProject.offset = currentProject.data.graph.getCanvasByViewport({ x: 0, y: 0 })
  currentProject.data.graph = null
})

</script>

<template>
  <div id="graph-container" ref="container"></div>
</template>

<style scoped>
#graph-container {
  width: calc(100vw - 24px * 2 - 240px);
  min-width: 1px !important;
}
</style>