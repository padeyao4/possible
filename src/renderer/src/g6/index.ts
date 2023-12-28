import '@renderer/assets/graph.css'
import './layout/possibleLayout'
import './node/possibleNode'
import './behavior/possibleNodeDrag'

import {nextTick, onBeforeUnmount, onMounted, ref, Ref, shallowRef, watch} from "vue";
import {Graph, GraphData, IEdge, IGraph, Menu} from "@antv/g6";
import PossibleGrid from "@renderer/g6/plugin/possibleGrid";
import {PossibleTimeBar} from "@renderer/g6/plugin/possibleTimeBar";
import {INode as G6INode, Item} from "@antv/g6-core";
import {PNode} from "@renderer/model";
import {useProject} from "@renderer/util/project";
import {useStore} from "@renderer/store/project";

export function useGraph(container: Ref<HTMLElement>,
                         timeBar: Ref<HTMLElement>) {
  const graph = shallowRef<IGraph>()
  const project = useProject()!
  const store = useStore()

  /**
   * witch node has active
   */
  const active = ref<string>()

  const dataIndex = () => {
    return store.dn - project.origin
  }

  function clearActive() {
    active.value = undefined
  }

  function addListen(graph: IGraph) {
    graph.on('edge:mouseover', (e) => {
      graph.setItemState(e.item as Item, 'hover', true)
    })

    graph.on('edge:mouseout', (e) => {
      graph.setItemState(e.item as Item, 'hover', false)
    })

    graph.on('canvas:dblclick', (e) => {
      const node = new PNode()
      node.name = '未命名'
      node.projectId = project.id
      node.normalXY(e.x, e.y)
      graph?.addItem('node', node as any)
      graph?.layout()
    })

    graph.on('node:dblclick', (e) => {
      active.value = e.item?.getID?.()
    })

    graph.on('node:dragend', () => {
      graph?.layout()
    })

    graph.on('aftercreateedge', (e) => {
      const edge = e.edge as IEdge

      const sourceNode = edge.getSource() as G6INode
      const targetNode = edge.getTarget() as G6INode

      // 删除自环边
      if (sourceNode === targetNode) {
        nextTick(() => {
          graph?.removeItem(edge)
        }).then(_ => {
        })
        return
      }

      // 删除重复边
      const count = sourceNode
        .getEdges()
        .filter(
          (e) =>
            e.getTarget().getID() === targetNode.getID() ||
            e.getSource().getID() === targetNode.getID()
        ).length
      if (count >= 2) {
        nextTick(() => {
          graph?.removeItem(edge)
        }).then(undefined)
        return
      }

      // 删除相同列的边
      if ((sourceNode.getModel().x as number) >= (targetNode.getModel().x as number)) {
        nextTick(() => {
          graph?.removeItem(edge)
        }).then(_ => {
        })
        return
      }
    })

    graph.on('viewportchange', () => {
      const {x, y} = graph?.getCanvasByPoint(0, 0) ?? {x: 0, y: 0}
      project.offset.x = x
      project.offset.y = y
    })

    graph.on('afterremoveitem', save)
    graph.on('afteradditem', save)
    graph.on('afterupdateitem', save)
  }


  function save() {
    const graphData = graph.value?.save() as GraphData
    project.data.nodes.clear()
    graphData?.nodes?.forEach(node => {
      project.data.nodes.set(node.id, PNode.from(node).x2dn())
    })
    project.data.edges.clear()
    graphData?.edges?.forEach(edge => {
      project.data.edges.set(edge.id as string, {
        id: edge.id as string,
        source: edge.source as string,
        target: edge.target as string
      })
    })
  }

  onMounted(() => {
    graph.value = new Graph({
      container: container.value,
      animate: true,
      animateCfg: {
        duration: 300
      },
      layout: {
        type: 'possible-layout',
        todayIndex: dataIndex(),
        nodeHeight: project.nodeHeight,
        gap: project.nodeMargin[0] + project.nodeMargin[2]
      },
      plugins: [
        new PossibleGrid(),
        new PossibleTimeBar(timeBar.value),
        new Menu({
          offsetX: -container.value.offsetLeft,
          offsetY: -container.value.offsetTop,
          getContent: () => {
            const menu = document.createElement('div')
            menu.className = 'graph-menu'
            menu.innerHTML = `<ul>
                              <li title="delay">延期</li>
                              <li title="move">平移</li>
                              <li title="delete">删除</li>
                            </ul>`
            return menu
          },
          handleMenuClick: (el: HTMLElement, item: Item) => {
            switch (el.title) {
              case 'delay': {
                delay(item)
                break
              }
              case 'move': {
                move(item)
                break
              }
              case 'delete': {
                graph.value?.removeItem(item)
                graph.value?.layout()
                break
              }
            }
          }
        })
      ],
      modes: {
        default: [
          {
            type: 'drag-canvas',
            allowDragOnItem: false,
            enableOptimize: true,
            scalableRange: 99
          },
          {
            type: 'possible-drag-node',
            enableOptimize: true
          },
          {
            type: 'create-edge',
            trigger: 'drag',
            key: 'shift'
          }
        ]
      },
      defaultNode: {
        type: 'task-node'
      },
      defaultEdge: {
        type: 'cubic-horizontal'
      },
      edgeStateStyles: {
        hover: {
          stroke: 'rgba(154,154,154,0.38)',
          lineWidth: 2
        }
      }
    })
    const {x, y} = project.offset
    const nodes = [...project.data.nodes.values()]
    nodes.forEach(node => node.dn2x())
    const data = {
      nodes,
      edges: [...project.data.edges.values()]
    }
    graph.value.data(data)
    graph.value.render()
    graph.value.translate(x, y)
    addListen(graph.value)
    watch(() => store.dn, () => {
      graph.value?.updateLayout({
        todayIndex: dataIndex()
      })
      graph.value?.emit('possible-update', {x: project.offset.x})
    })
    window.addEventListener('resize', () => {
      if (container.value) {
        graph.value?.changeSize(container.value.clientWidth, container.value.clientHeight)
      }
    })
  })

  /**
   * 项目及后续项目平移
   * @param item
   */
  function move(item: Item) {
    function moveItem(item: Item) {
      const id = item.getID()
      const node: PNode = Object.assign(new PNode(), graph.value!.findById(id).getModel())
      const hors = graph.value?.getNeighbors(node.id, "target")
      hors?.map(h => moveItem(h))
      node.x += node.cellWidth
      graph.value?.update(item.getID(), node as any)
    }

    moveItem(item)
    graph.value?.layout()
  }

  /**
   * 普通正常任务延期
   * @param item
   */
  function delay(item: Item) {
    function delayItem(item: Item) {
      const id = item.getID()
      const node = Object.assign(new PNode(), graph.value?.findById(id).getModel())
      if (node.taskType !== 'general') return false
      if (node.state !== 'normal') return false
      const hors = graph.value?.getNeighbors(node.id, "target").filter(h => (h.getModel()?.x ?? 0) - node.x === node.cellWidth)
      if (hors?.length === 0) {
        node.x += node.cellWidth
        graph.value?.update(item.getID(), node)
        return true
      } else {
        const ans = hors?.map(h => delayItem(h)).filter(v => !v)
        if (ans?.length !== 0) {
          return false
        } else {
          node.x += node.cellWidth
          graph.value?.update(item.getID(), node)
          return true
        }
      }
    }

    delayItem(item)
    graph.value?.layout()
  }

  onBeforeUnmount(() => {
    save()
    graph.value?.destroy()
    graph.value = undefined
  })

  return {graph, active, clearActive}
}
