import { onBeforeUnmount, onMounted, Ref, shallowRef } from 'vue'
import { extend, Graph as BaseGraph, GraphData, IGraph, NodeDisplayModel } from '@antv/g6'
import GridPlugin from '@renderer/g6/plugin/gridPlugin'
import TimerPlugin from '@renderer/g6/plugin/timerPlugin'
import CreateNode from '@renderer/g6/behavior/createNode'
import { CardNode } from '@renderer/g6/node/customNode'
import { useProject } from '@renderer/util/project'
import { PProject } from '@renderer/model'

const Graph = extend(BaseGraph, {
  nodes: {
    'card-node': CardNode
  },
  plugins: {
    grid: GridPlugin,
    timer: TimerPlugin
  },
  behaviors: {
    'create-node': CreateNode
  }
})

export function useGraph(container: Ref<HTMLElement>, timerContainer: Ref<HTMLElement>) {
  const graph = shallowRef<IGraph<any, any>>()
  const project = useProject() as PProject

  async function resize() {
    const p1 = graph.value!.getCanvasByViewport({ x: 0, y: 0 })
    graph.value!.setSize([container.value.clientWidth, container.value.clientHeight])
    const p2 = graph.value!.getCanvasByViewport({ x: 0, y: 0 })
    await graph.value!.translate({ dx: p2.x - p1.x, dy: p2.y - p1.y })
  }

  onMounted(() => {
    graph.value = new Graph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      modes: {
        default: ['drag-canvas', 'drag-node', 'create-node']
      },
      plugins: [
        'grid',
        {
          key: 'timer',
          type: 'timer',
          container: timerContainer.value,
          project
        }
      ],
      node: (model) => {
        const { id, data } = model
        return {
          id,
          data: {
            ...data,
            type: 'card-node',
            keyShape: {
              radius: 4,
              width: data.width,
              height: data.height
            },
            otherShapes: {}
          }
        } as NodeDisplayModel
      }
    })
    graph.value.read(project.toGraphData() as GraphData)
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    graph.value?.destroy()
  })

  return { graph }
}
