import {useStore} from "@renderer/store/project";
import {CURRENT_DATA_VERSION} from "@renderer/common/constant";
import {PEdge, PNode} from "@renderer/model";
import {index2X} from "@renderer/util/index";

/**
 * 将store project 按格式导出
 */
export function dumps(id: string | undefined = undefined) {
  const store = useStore()
  return JSON.stringify({
    data: (id ? [store.projects.get(id)] : store.projects),
    time: new Date().getTime(),
    version: CURRENT_DATA_VERSION
  })
}

/**
 * 加载字符串数据
 * @param text
 */
export function loads(text: string | undefined | null) {
  if (text === undefined || text === null) return
  const content = JSON.parse(text)
  if (content.version !== CURRENT_DATA_VERSION) return;
  useStore().merge(content.data)
}

/**
 * 根据时间更新和布局节点
 * @param index
 * @param nodes
 * @param edges
 */
export function delayLayout({index, nodes, edges}: {
  index: number
  nodes: PNode[]
  edges: PEdge[]
}) {
  const map = new Map<number, PNode[]>()

  const edgesMap = new Map<string, string>()

  edges.forEach((edge) => {
    edgesMap.set(edge.source, edge.target)
  })

  const nodesMap = new Map<string, PNode>()

  nodes.forEach((node) => {
    nodesMap.set(node.id, node)
  })

  const idx = index2X(index)

  const handleNodeState = (node: PNode, currentX: number) => {
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
  const handleNode = (node: PNode, currentX: number): boolean => {
    if (edgesMap.has(node.id)) {
      const nextId = edgesMap.get(node.id) as string
      const nextNode = nodesMap.get(nextId) as PNode
      if (handleNode(nextNode,
        currentX + node.width + node.margin[1] + node.margin[3])) {
        return handleNodeState(node as any, currentX)
      } else {
        return false
      }
    } else {
      return handleNodeState(node as any, currentX)
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
      const gap = item.height + item.margin[0] + item.margin[2]
      item.y = Math.floor(item.y / gap) * gap + 42
      while (ySet.has(item.y)) {
        item.y += gap
      }
      ySet.add(item.y)
    })
  })

  map.clear()
}
