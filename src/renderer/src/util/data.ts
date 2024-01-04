import { useStore } from '@renderer/store'
import { PEdge, PNode, Store } from '@renderer/model'
import { index2X } from '@renderer/util/index'
import { instanceToPlain, plainToInstance } from 'class-transformer'

/**
 * 将store project 按格式导出
 */
export function dumps() {
  return JSON.stringify(instanceToPlain<Store>(useStore().$state))
}

/**
 * 加载字符串数据
 */
export async function loads() {
  const text = await window.api.loadLocalData()
  if (text === null) return
  useStore().merge(plainToInstance(Store, JSON.parse(text)))
}

export async function loadFromDialog() {
  const text = await window.api.openFile()
  if (text === null) return
  useStore().merge(plainToInstance(Store, JSON.parse(text)))
}

/**
 * 根据id获取子节点id
 * @param id
 * @param edges
 */
function children(id: string, edges: Map<string, PEdge>): string[] {
  return [
    ...new Set(
      [...edges.values()].filter((edge) => edge.source === id).map((edge) => edge.target)
    ).values()
  ]
}

function normalNode(node: PNode) {
  return node.taskType === 'general' && node.state === 'normal'
}

function changeNodeDn(node: PNode, nodes: Map<string, PNode>, edges: Map<string, PEdge>) {
  const nextChildren = children(node.id, edges)
    .map((child) => nodes.get(child) as PNode)
    .filter((f) => f.dn === node.dn + 1)
  if (nextChildren.length === 0) {
    node.dn += 1
    return true
  } else {
    const otherNodes = nextChildren.filter((next) => !normalNode(next))
    if (otherNodes.length === 0) {
      const ans = nextChildren
        .map((next) => changeNodeDn(next, nodes, edges))
        .every((child) => child)
      if (ans) {
        node.dn += 1
      }
      return ans
    } else {
      return false
    }
  }
}

export function dataUpdate(dn: number, nodes: Map<string, PNode>, edges: Map<string, PEdge>) {
  ;[...nodes.values()]
    .filter((node) => normalNode(node))
    .filter((node) => node.dn < dn)
    .forEach((node) => {
      while (dn - node.dn > 0) {
        changeNodeDn(node, nodes, edges)
      }
    })
}

/**
 * 根据时间更新和布局节点
 * @param index
 * @param nodes
 * @param edges
 */
export function graphLayout({
  index,
  nodes,
  edges
}: {
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
      if (handleNode(nextNode, currentX + node.width + node.margin[1] + node.margin[3])) {
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

/**
 * 初始化系统环境变量
 */
export async function initEnv() {
  useStore().dev = await window.api.isDev()
}
