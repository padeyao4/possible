import { onBeforeUnmount, onMounted, Ref } from 'vue'
import { extend, Graph as BaseGraph, GraphData, IGraph, NodeDisplayModel } from '@antv/g6'
import GridPlugin from '@renderer/g6/plugin/gridPlugin'
import TimerPlugin from '@renderer/g6/plugin/timerPlugin'
import CreateNode from '@renderer/g6/behavior/createNode'
import { CardNode } from '@renderer/g6/node/customNode'
import { useProject } from '@renderer/util/project'
import { PEdge, PNode, PProject } from '@renderer/model'
import { plainToInstance } from 'class-transformer'
import { NodeDragEnd } from '@renderer/g6/behavior/afterNodeDrag'

const Graph = extend(BaseGraph, {
  nodes: {
    'card-node': CardNode
  },
  plugins: {
    grid: GridPlugin,
    timer: TimerPlugin
  },
  behaviors: {
    'create-node': CreateNode,
    'node-dragend': NodeDragEnd
  }
})

export function useGraph(container: Ref<HTMLElement>, timerContainer: Ref<HTMLElement>) {
  let graph: IGraph<any, any>
  const project = useProject() as PProject

  async function resize() {
    const p1 = graph.getCanvasByViewport({ x: 0, y: 0 })
    graph.setSize([container.value.clientWidth, container.value.clientHeight])
    const p2 = graph.getCanvasByViewport({ x: 0, y: 0 })
    await graph.translate({ dx: p2.x - p1.x, dy: p2.y - p1.y })
  }

  onMounted(async () => {
    graph = new Graph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      modes: {
        default: ['drag-canvas', 'drag-node', 'create-node', 'node-dragend', 'select-node']
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
              radius: 6,
              width: data.width,
              height: data.height
            },
            otherShapes: {}
          }
        } as NodeDisplayModel
      }
    })
    setTimeout(async () => {
      graph.read(project.toGraphData() as GraphData)
      const { x: x1, y: y1 } = graph.getCanvasByViewport({ x: 0, y: 0 })
      const { x: x2, y: y2 } = project.offset
      await graph.translate({ dx: x1 - x2, dy: y1 - y2 })
    })
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    graph.getAllNodesData().forEach((model) => {
      project.nodes.set(model.id as string, plainToInstance(PNode, model.data))
    })
    graph.getAllEdgesData().forEach((model) => {
      project.edges.set(model.id as string, plainToInstance(PEdge, model))
    })
    project.offset = graph.getCanvasByViewport({ x: 0, y: 0 })
    graph.destroy()
  })

  /**
   * 跳转到具体日期
   */
  function goto() {}

  return { graph: graph! }
}
