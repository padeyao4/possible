import { onBeforeUnmount, onMounted, Ref } from 'vue'
import {
  BehaviorRegistry,
  EdgeUserModel,
  extend,
  Extensions,
  Graph as BaseGraph,
  GraphData,
  ID,
  IGraph,
  NodeDisplayModel,
  NodeUserModel
} from '@antv/g6'
import GridPlugin from '@renderer/g6/plugin/gridPlugin'
import TimerPlugin from '@renderer/g6/plugin/timerPlugin'
import CreateNode from '@renderer/g6/behavior/createNode'
import { CardNode } from '@renderer/g6/node/customNode'
import { useProject } from '@renderer/util/project'
import { PEdge, PNode, PProject } from '@renderer/model'
import { plainToInstance } from 'class-transformer'
import { NodeDragEnd } from '@renderer/g6/behavior/dragNode'
import { date2Index } from '@renderer/util'
import { IG6GraphEvent } from '@antv/g6/src/types/event'
import { ThemeRegistry } from '@antv/g6/lib/types/theme'
import { getRelationNodes, nodesMoveLeft } from '@renderer/g6/utils/data'

const Graph = extend(BaseGraph, {
  nodes: {
    'card-node': CardNode
  },
  plugins: {
    grid: GridPlugin,
    timer: TimerPlugin,
    menu: Extensions.Menu
  },
  behaviors: {
    'create-node': CreateNode,
    'node-dragend': NodeDragEnd
  }
})

function menuAddNode(graphNode: NodeUserModel, graph: IGraph<BehaviorRegistry, ThemeRegistry>) {
  const node = plainToInstance(PNode, graphNode.data).moveLeft()
  const newNode = new PNode()
  newNode.x = node.x
  newNode.y = node.y
  newNode.name = 'n' + Math.floor(Math.random() * 100)
  graph.addData('node', newNode.toGraphNode())
  const edge = new PEdge(node.id, newNode.id)
  graph.addData('edge', edge.toGraphEdge() as EdgeUserModel)
}

/**
 * 卡片右键菜单
 */
const contextMenu = {
  type: 'menu',
  key: 'node-context-menu',
  trigger: 'contextmenu',
  offsetX: -264, // 离左侧距离
  offsetY: -72, // 离最顶部距离
  /** async string menu
   *  add 添加
   *  insert 在原地插入新节点,后续节点左移一个单位
   *  append 在当前节点后追加一个节点，后续节点左移一个单位
   * */
  getContent: () => {
    return `
    <ul class='g6-contextmenu-ul' style="">
      <li class='g6-contextmenu-li' code='add' > Add </li>
      <li class='g6-contextmenu-li' code='insert' > Insert </li>
      <li class='g6-contextmenu-li' code='append' > Append </li>
      <li class='g6-contextmenu-li' code='delete'> Delete </li>
    </ul>
  `
  },
  handleMenuClick: (target: HTMLLIElement, itemId: ID, graph: IGraph) => {
    const { value } = Object.values(target.attributes)?.find((item) => item.name === 'code') ?? {
      value: 'default'
    }
    const graphNode = graph.getNodeData(itemId)!
    switch (value) {
      case 'delete':
        graph.removeData('node', itemId)
        break
      case 'add': {
        menuAddNode(graphNode, graph)
        break
      }
      case 'insert': {
        const nodeIds = getRelationNodes(graph, itemId, 'children')
        nodesMoveLeft(graph, [...nodeIds.values()])
        // todo 插入节点
        break
      }
      default:
        return
    }
  }
}

const dragNode = {
  type: 'drag-node',
  key: 'p-drag-node',
  shouldBegin: (event: IG6GraphEvent) => {
    return event.button === 0 && !event.shiftKey
  }
}

const dragCanvas = {
  type: 'drag-canvas',
  key: 'p-drag-canvas',
  shouldBegin: (event: IG6GraphEvent) => event.button === 0
}

export function useGraph(container: Ref<HTMLElement>, timerContainer: Ref<HTMLElement>) {
  let graph: IGraph<any, any>
  const project = useProject() as PProject

  async function resize() {
    const { x: x1, y: y1 } = graph.getCanvasByViewport({ x: 0, y: 0 })
    graph.setSize([container.value.clientWidth, container.value.clientHeight])
    const { x: x2, y: y2 } = graph.getCanvasByViewport({ x: 0, y: 0 })
    await graph.translate({ dx: x2 - x1, dy: y2 - y1 })
  }

  onMounted(async () => {
    graph = new Graph({
      container: container.value,
      width: container.value.clientWidth,
      height: container.value.clientHeight,
      modes: {
        default: [dragCanvas, dragNode, 'create-node', 'node-dragend']
      },
      plugins: [
        'grid',
        {
          type: 'timer',
          key: 'p-timer',
          container: timerContainer.value,
          project
        },
        contextMenu
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
    graph.on('begincreate', () => {
      graph.setCursor('crosshair')
    })
    graph.on('cancelcreate', () => {
      graph.setCursor('default')
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
  function goto(date: Date) {
    const x1 = (date2Index(date) - project.origin) * project.cellWidth
    setTimeout(async () => {
      const { x: x2, y: y2 } = graph.getCanvasByViewport({ x: 0, y: 0 })
      await graph.translate({ dx: x2 - x1, dy: y2 })
    })
  }

  return { graph: graph!, goto }
}
