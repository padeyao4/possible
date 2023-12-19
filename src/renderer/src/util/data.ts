import {useStore} from "@renderer/store/project";
import {CURRENT_DATA_VERSION} from "@renderer/common/constant";
import {PEdge, PNode, PProject} from "@renderer/model";
import {index2X} from "@renderer/util/index";
import {PossibleData} from "@renderer/types";

function replacer(_key: any, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()) // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

function reviver(_key: any, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

/**
 * 将store project 按格式导出
 */
export function dumps() {
  const store = useStore()
  console.log('save', store.projects)
  return JSON.stringify({
    data: {
      projects: store.projects,
      dn: store.dn,
      experiment: store.experiment,
      autoUpdateDate: store.autoUpdateDate
    },
    time: new Date().getTime(),
    version: CURRENT_DATA_VERSION
  }, replacer)
}

/**
 * 加载字符串数据
 * @param text
 */
export function loads(text: string | null) {
  if (text === null) return
  const content: PossibleData = JSON.parse(text, reviver)
  if (content.version !== CURRENT_DATA_VERSION) return;
  const ans = new Map<string, PProject>();
  ;[...content.data.projects.values()].map(p => {
    const project = Object.assign(new PProject(), p)
    const nodeMaps = new Map<string, PNode>()
    ;[...project.data.nodes.values()].map(n => Object.assign(new PNode(), n)).forEach(n => {
      nodeMaps.set(n.id, n)
    })
    project.data.nodes = nodeMaps
    const edgeMaps = new Map<string, PEdge>()
    ;[...project.data.edges.values()].map(e => Object.assign(new PEdge(), e)).forEach(e => {
      edgeMaps.set(e.id, e)
    })
    project.data.edges = edgeMaps
    return project
  }).forEach(p => {
    ans.set(p.id, p)
  })
  content.data.projects = ans
  useStore().merge(content)
}

/**
 * 根据id获取子节点id
 * @param id
 * @param edges
 */
function children(id: string, edges: Map<string, PEdge>): string[] {
  return [...new Set([...edges.values()].filter(edge => edge.source === id).map(edge => edge.target)).values()]
}

function normalNode(node: PNode) {
  return node.taskType === 'general' && node.state === 'normal'
}

function changeNodeDn(node: PNode, nodes: Map<string, PNode>, edges: Map<string, PEdge>) {
  const nextChildren = children(node.id, edges).map(child => nodes.get(child)!).filter(f => f.dn === node.dn + 1)
  if (nextChildren.length === 0) {
    node.dn += 1
    return true
  } else {
    const otherNodes = nextChildren.filter(next => !normalNode(next))
    if (otherNodes.length === 0) {
      const ans = nextChildren.map(next => changeNodeDn(next, nodes, edges)).every(child => child)
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
  [...nodes.values()]
    .filter(node => normalNode(node))
    .filter(node => node.dn < dn)
    .forEach(node => {
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
export function graphLayout({index, nodes, edges}: {
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
