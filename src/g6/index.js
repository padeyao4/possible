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

export default function useGraph(container) {
  const { currentProject } = useStore()
  const graph = shallowRef()
  const current = ref({ id: '', data: { name: '' } })
  const selected = ref(false)

  onMounted(() => {
    const ExtGraph = extend(CustomGraph, {
      nodes: { CardNode }, plugins: { GridPlugin }, behaviors: { CreateNode, DragCanvas, DragNode, CreateEdge }
    })
    graph.value = new ExtGraph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      plugins: ['GridPlugin'],
      modes: {
        default: ['DragCanvas', 'CreateNode', 'DragNode', 'CreateEdge']
      },
      node: (model) => {
        const { id, data } = model
        return {
          id,
          data: {
            type: 'CardNode',
            anchorPoints: [[0, 0.5], [1, 0.5]],
            keyShape: {
              radius: 6, width: 80, height: 40
            },
            otherShapes: {},
            anchorShapes: {},
            labelShape: {},
            ...data
          }
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
  })

  onBeforeUnmount(() => {
    currentProject.nodes = graph.value.getAllNodesData()
    currentProject.edges = graph.value.getAllEdgesData()
  })

  return { graph, current, selected }
}