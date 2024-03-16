import { Graph } from '@antv/g6'
import { reactive } from 'vue'

export class CustomGraph extends Graph {

  userData = reactive({
    selectItem: undefined,
    // 'edit'|'none'|'contextmenu'
    status: 'none',
    pointerPosition: { x: 0, y: 0 }
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

  /**
   * 检查是否存在节点
   * @param id
   * @returns {*}
   */
  hasNode(id){
    return this.dataController.graphCore.hasNode(id)
  }
}