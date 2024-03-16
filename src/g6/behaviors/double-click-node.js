import { Extensions } from '@antv/g6'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

export default class DoubleClickNode extends Extensions.BaseBehavior {

  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'node:dblclick': this.doubleClick
    }
  }

  doubleClick(e) {
    if (!this.options.shouldBegin(e)) return
    const { itemId } = e
    const { userData } = this.graph
    userData.doubleNodeClick = true
    userData.selectItem = this.graph.getNodeData(itemId)
  }
}