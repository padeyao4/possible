import { computed, onBeforeUnmount, onMounted, Ref, shallowRef } from 'vue'
import { extend, Graph as BaseGraph, IGraph, NodeDisplayModel } from '@antv/g6'
import GridPlugin from '@renderer/g6/plugin/gridPlugin'
import TimerPlugin from '@renderer/g6/plugin/timerPlugin'
import { useStore } from '@renderer/store/project'
import { useRoute } from 'vue-router'
import CreateNode from '@renderer/g6/behavior/createNode'
import { CardNode } from '@renderer/g6/node/customNode'

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
  const store = useStore()
  const route = useRoute()

  const project = computed(() => {
    return store.projects.get(route.params.id as string)
  })

  const data = {
    nodes: [
      {
        id: 'node1',
        data: {
          name: 'Circle1',
          x: 120,
          y: 100
        }
      },
      {
        id: 'node2',
        data: {
          name: 'Circle2',
          x: 240,
          y: 400
        }
      }
    ],
    edges: [
      {
        id: 'edge1',
        source: 'node1',
        target: 'node2'
      }
    ]
  }

  function resize() {
    const g = graph.value as IGraph
    const p1 = g.getCanvasByViewport({ x: 0, y: 0 })
    g.setSize([container.value.clientWidth, container.value.clientHeight])
    const p2 = g.getCanvasByViewport({ x: 0, y: 0 })
    g.translate({ dx: p2.x - p1.x, dy: p2.y - p1.y }).then(() => undefined)
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
          project: project.value
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
              width: 100,
              height: 40
            },
            otherShapes: {}
          }
        } as NodeDisplayModel
      }
    })
    graph.value.read(data as any)
    window.addEventListener('resize', resize)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    graph.value?.destroy()
  })

  return { graph }
}
