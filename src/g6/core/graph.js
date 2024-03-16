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
   * @returns {{id:string|number,data:any}} models
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
   * @param nodeId
   * @returns {*}
   */
  hasNode(nodeId){
    return this.dataController.graphCore.hasNode(nodeId)
  }

  /**
   * Recursively gets all predecessor node IDs for the given node ID.
   * 
   * @param {string|number} nodeId - The ID of the node to get predecessors for.
   * @returns {Set} A Set containing all predecessor node IDs.
   */
  getAllPredecessorsIds(nodeId) {
    const predecessors = []
    const models = this.getPredecessors(nodeId).map(model => model.id)
    if (models && models.length > 0) {
      models.forEach(s => {
        predecessors.push(...this.getAllPredecessorsIds(s))
      })
    }
    return new Set([...predecessors, nodeId])
  }

    /**
   * Recursively gets all predecessor node IDs for the given node ID.
   * @param {string|number} nodeId - The ID of the node to get predecessors for.
   * @returns {Array} An array containing all predecessor node models.
   */
  getAllPredecessors(nodeId) {
    const ids = this.getAllPredecessorsIds(nodeId)
    ids.delete(nodeId)
    console.log(ids);
    return [...ids].map(id => {
      return this.getNodeData(id)
    })
  }
}