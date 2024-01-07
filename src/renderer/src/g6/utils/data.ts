import { ID, IGraph } from '@antv/g6'
import { plainToInstance } from 'class-transformer'
import { PNode } from '@renderer/model'

/**
 * 找到所有子节点,包含当前节点
 * @param graph
 * @param nodeId
 */
export function findAllChildren(graph: IGraph, nodeId: ID) {
  const edgesVisited = new Set<ID>()
  const queueEdges: ID[] = graph.getRelatedEdgesData(nodeId, 'out').map((edge) => edge.id)
  const ans = new Set<ID>([nodeId])
  while (queueEdges.length !== 0) {
    const edgeId = queueEdges.shift()
    if (edgeId && !edgesVisited.has(edgeId)) {
      edgesVisited.add(edgeId)
      const edge = graph.getEdgeData(edgeId)
      if (edge?.target) {
        ans.add(edge.target)
        queueEdges.push(...graph.getRelatedEdgesData(edge.target, 'out').map((e) => e.id))
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
export function moveLeftNodes(graph: IGraph, nodeIds: ID[]) {
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
