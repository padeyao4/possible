import G6 from '@antv/g6'
import { IEdge, INode } from '@renderer/model'
import { index2X } from '@renderer/util'
import { EdgeConfig, NodeConfig } from '@antv/g6-core'

G6.registerLayout('possible-layout', {
  /**
   * 定义自定义行为的默认参数，会与用户传入的参数进行合并
   */
  getDefaultCfg() {
    return {
      todayIndex: this.todayIndex,
      nodeHeight: 80,
      gap: 100
    }
  },

  /**
   * 执行布局
   */
  execute() {
    const {
      todayIndex,
      gap,
      nodes,
      edges
    }: {
      todayIndex: number
      nodeHeight: number
      gap: number
      nodes: (INode & NodeConfig)[]
      edges: (EdgeConfig & IEdge)[]
    } = this

    const map = new Map<number, (INode & NodeConfig)[]>()

    const edgesMap = new Map<string, string>()

    edges.forEach((edge) => {
      edgesMap.set(edge.source, edge.target)
    })

    const nodesMap = new Map<string, INode & NodeConfig>()

    nodes.forEach((node) => {
      nodesMap.set(node.id, node)
    })

    const idx = index2X(todayIndex)

    const handleNodeState = (node: INode & NodeConfig, currentX: number) => {
      if (node.state === 'normal' && node.taskType === 'general') {
        if (node.x < currentX) {
          node.x = currentX
        }
        return true
      } else {
        return node.x >= currentX
      }
    }
    /**
     * 递归处理节点
     * @param node
     * @param currentX
     */
    const handleNode = (node: INode & NodeConfig, currentX: number): boolean => {
      if (edgesMap.has(node.id)) {
        const nextId = edgesMap.get(node.id) as string
        const nextNode = nodesMap.get(nextId) as INode & NodeConfig
        if (handleNode(nextNode, currentX + 120)) {
          return handleNodeState(node, currentX)
        } else {
          return false
        }
      } else {
        return handleNodeState(node, currentX)
      }
    }

    // todo 超期更改状态

    nodes
      .map((n) => {
        handleNode(n, idx)
        return n
      })
      .sort((n1, n2) => n1.y - n2.y)
      .forEach((n) => {
        const r = map.get(n.x)
        if (r === undefined) {
          map.set(n.x, [n])
        } else {
          r.push(n)
        }
      })

    map.forEach((items) => {
      const ySet = new Set<number>()
      items.forEach((item) => {
        // item.y = index * nodeHeight + gap
        item.y = Math.floor(item.y / gap) * gap + 42
        while (ySet.has(item.y)) {
          item.y += gap
        }
        ySet.add(item.y)
      })
    })

    map.clear()
  },
  /**
   * 销毁
   */
  destroy() {
    return
  }
})
