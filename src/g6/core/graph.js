import { Graph } from '@antv/g6'

export class CustomGraph extends Graph {

  async transform(options, effectTiming) {
    const { tileLodSize } = this.specification.optimize || {}
    await this.hooks.viewportchange.emitLinearAsync({
      transform: options,
      effectTiming,
      tileLodSize
    })
    this.emit('viewportchange', options)
  }

  /**
   * 获取前辈节点
   * @param nodeId
   * @returns {*}
   */
  getPredecessors(nodeId) {
    return this.dataController.graphCore.getPredecessors(nodeId)
  }

  /**
   * 获取后辈节点
   * @param nodeId
   * @returns {*}
   */
  getSuccessors(nodeId) {
    return this.dataController.graphCore.getSuccessors(nodeId)
  }
}