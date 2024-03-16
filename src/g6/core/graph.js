import { Graph } from '@antv/g6'
import { reactive } from 'vue'

export class CustomGraph extends Graph {

  userData = reactive({
    selectItem: undefined,
    doubleNodeClick: false
  })

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

  /**
   * 检查节点是否重合
   * @returns {boolean}
   * @param x {number}
   * @param y {number}
   */
  checkNodeOverlap(x, y) {
    return this.getAllNodesData()
      .some(model => model.data.x === x && model.data.y === y)
  }
}