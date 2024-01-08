import { ID, IGraph } from '@antv/g6'
import { plainToInstance } from 'class-transformer'
import { PNode } from '@renderer/model'

/**
 * 找到所有子节点,包含当前节点
 * @param graph
 * @param nodeId
 * @param relation
 */
export function getRelationNodes(
  graph: IGraph,
  nodeId: ID,
  relation: 'all' | 'parents' | 'children' = 'all'
) {
  const mapper = {
    all: 'both',
    parents: 'in',
    children: 'out'
  }
  const edgesVisited = new Set<ID>()
  const queueEdges: ID[] = graph
    .getRelatedEdgesData(nodeId, mapper[relation] as never)
    .map((edge) => edge.id)
  const ans = new Set<ID>([nodeId])
  while (queueEdges.length !== 0) {
    const edgeId = queueEdges.shift()
    if (edgeId && !edgesVisited.has(edgeId)) {
      edgesVisited.add(edgeId)
      const edge = graph.getEdgeData(edgeId)
      if (edge?.target) {
        ans.add(edge.target)
        const ids = graph
          .getRelatedEdgesData(edge.target, mapper[relation] as never)
          .map((e) => e.id)
        queueEdges.push(...ids)
      }
    }
  }
  return ans
}

/**
 * 所有节点左移动一个单位
 * @param graph
 * @param nodeIds
 */
export function nodesMoveLeft(graph: IGraph, nodeIds: ID[]) {
  const updatedCache: Record<string, any>[] = []
  nodeIds.forEach((id) => {
    const plain = graph.getNodeData(id)
    if (plain) {
      const instance = plainToInstance(PNode, plain.data)
      const nodeData = instance.moveLeft().toGraphNode()
      updatedCache.push(nodeData)
    }
  })
  graph.updateNodePosition(updatedCache)
}

/**
 * 根据x轴坐标获取节点
 * @param graph
 * @param n
 */
export function getNodesByX(graph: IGraph, n: number) {
  return graph
    .getAllNodesData()
    .filter(({ data: { x } }) => x !== undefined && Math.abs(x - n) <= 0.1)
}
