import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { extend } from '@antv/g6'
import { CardNode } from '@/g6/node/custom-node.js'
import CreateNode from '@/g6/behaviors/create-node.js'
import GridPlugin from '@/g6/plugin/grid-plugin.js'
import CreateEdge from '@/g6/behaviors/create-edge.js'
import { DragNode } from '@/g6/behaviors/drag-node.js'
import { useStore } from '@/stores/store'
import { DragCanvas } from '@/g6/behaviors/drag-canvas.js'
import { CustomGraph } from '@/g6/graph.js'
import { HoverNode } from '@/g6/behaviors/hover-node.js'

export default function useGraph(container) {
  const { currentProject } = useStore()
  const graph = shallowRef()
  const current = ref({ id: '', data: { name: '' } })
  const selected = ref(false)

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
      behaviors: { CreateNode, DragCanvas, DragNode, CreateEdge, HoverNode }
    })

    graph.value = new ExtGraph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      enableStack: false,
      plugins: ['GridPlugin'],
      modes: {
        default: ['DragCanvas', 'CreateNode', 'DragNode', 'CreateEdge', 'HoverNode']
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
      data: {
        nodes: currentProject.nodes,
        edges: currentProject.edges
      }
    })

    graph.value.on('node:dblclick', (e) => {
      // todo 通过自定义事件简化写法
      current.value = graph.value.getNodeData(e.itemId)
      selected.value = true
    })

    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    currentProject.nodes = graph.value.getAllNodesData()
    currentProject.edges = graph.value.getAllEdgesData()
    window.removeEventListener('resize', resize)
  })

  return { graph, current, selected }
}