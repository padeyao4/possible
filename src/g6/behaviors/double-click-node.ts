import { Extensions, type IG6GraphEvent } from '@antv/g6'
import { useStore } from '@/stores/store'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event: any) => event.button === 0
}

export default class DoubleClickNode extends Extensions.BaseBehavior {

  store = useStore()

  constructor(options: any) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'node:dblclick': this.doubleClick
    }
  }

  doubleClick(e: IG6GraphEvent) {
    if (!this.options.shouldBegin(e)) return
    const { itemId } = e
    this.store.selectedNode = { ...this.graph.getNodeData(itemId) }
    this.store.actionState = 'edit'
  }
}