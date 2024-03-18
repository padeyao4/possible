import { useStore } from '@/stores/store'
import { Graph } from '@antv/g6'
import { reactive } from 'vue'

export class CustomGraph extends Graph {

  userData = reactive({
    selectItem: { id: '', data: {} },
    status: 'none', // 'edit'|'none'|'contextmenu'
    pointerPosition: { x: 0, y: 0 } // 用于contextmenu定位
  })

  /**
   * save project data to store
   * @param {string} projectId
   */
  saveData(projectId) {
    const store = useStore()
    const project = store.projects[projectId]
    console.log(project)
    project.nodes = this.getAllNodesData()
    project.edges = this.getAllEdgesData()
    console.log({ nodes: project.nodes, edges: project.edges })
  }

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
  hasNode(nodeId) {
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
    return [...ids].map(id => {
      return this.getNodeData(id)
    })
  }

  getAllSuccessorsIds(nodeId) {
    const successors = []
    const models = this.getSuccessors(nodeId).map(model => model.id)
    if (models && models.length > 0) {
      models.forEach(s => {
        successors.push(...this.getAllSuccessorsIds(s))
      })
    }
    return new Set([...successors, nodeId])
  }

  /**
   * Recursively gets all successor node models for the given node ID.
   * @param {string|number} nodeId - The ID of the node to get successors for.
   * @returns {Array} An array containing all successor node models.
   */
  getAllSuccessors(nodeId) {
    const ids = this.getAllSuccessorsIds(nodeId)
    ids.delete(nodeId)
    return [...ids].map(id => {
      return this.getNodeData(id)
    })
  }

  toJson() {
    return this.dataController.graphCore.toJSON()
  }
}