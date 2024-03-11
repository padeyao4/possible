import { onMounted, ref, shallowRef } from 'vue'
import { extend, Graph } from '@antv/g6'
import { CardNode } from '@/g6/node/custom-node.js'
import CreateNode from '@/g6/behaviors/create-node.js'
import { NodeDragend } from '@/g6/behaviors/dragend-node.js'
import GridPlugin from '@/g6/plugin/grid-plugin.js'

export default function useGraph(container) {
  const graph = shallowRef()
  const current = ref({ id: '', data: { name: '' } })
  const selected = ref(false)

  onMounted(() => {
    const ExtGraph = extend(Graph, {
      nodes: { CardNode }, plugins: { GridPlugin }, behaviors: { CreateNode, NodeDragend }
    })
    graph.value = new ExtGraph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      plugins: ['GridPlugin'],
      modes: {
        default: [{
          type: 'drag-canvas', key: 'drag-canvas', shouldBegin: (event) => event.button === 0
        }, 'CreateNode', {
          type: 'drag-node', key: 'drag-node', shouldBegin: (event) => event.button === 0
        }, 'NodeDragend']
      },
      node: (model) => {
        const { id, data } = model
        return {
          id, data: {
            ...data, type: 'CardNode', keyShape: {
              radius: 6, width: 80, height: 40
            }, otherShapes: {}
          }
        }
      }
    })
    // 先读取数据，否则graph点击有bug
    graph.value.read({})

    graph.value.on('node:dblclick', (e) => {
      current.value = graph.value.getNodeData(e.itemId)
      selected.value = true
    })
  })

  return { graph, current, selected }
}