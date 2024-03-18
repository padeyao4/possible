import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { extend } from '@antv/g6'
import CardNode from '@/g6/node/custom-node'
import CreateNode from '@/g6/behaviors/create-node'
import GridPlugin from '@/g6/plugin/grid-plugin'
import CreateEdge from '@/g6/behaviors/create-edge'
import DragNode from '@/g6/behaviors/drag-node'
import { useStore } from '@/stores/store'
import { DragCanvas } from '@/g6/behaviors/drag-canvas'
import { CustomGraph } from '@/g6/core/graph.js'
import { HoverNode } from '@/g6/behaviors/hover-node'
import DoubleClickNode from '@/g6/behaviors/double-click-node'
import ContextMenu from '@/g6/behaviors/context-menu'

export default function useGraph(container: any) {
  const store = useStore()
  const { currentProject } = store
  const graph = shallowRef<CustomGraph>()

  async function resize() {
    const { x: x1, y: y1 } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    graph.value.setSize([container.value.clientWidth, container.value.clientHeight])
    const { x: x2, y: y2 } = graph.value.getCanvasByViewport({ x: 0, y: 0 })
    await graph.value.translate({ dx: x2 - x1, dy: y2 - y1 })
  }

  onMounted(() => {
    const ExtGraph = extend(CustomGraph, {
      nodes: { CardNode },
      plugins: { GridPlugin },
      behaviors: { CreateNode, DragCanvas, DragNode, CreateEdge, HoverNode, DoubleClickNode, ContextMenu }
    })

    graph.value = new ExtGraph({
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

    store.updateGraph(graph.value)

    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    graph.value.destroy()
  })

  return graph
}