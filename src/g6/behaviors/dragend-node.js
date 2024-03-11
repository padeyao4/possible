import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/g6/utils/position-util.js'

const DEFAULT_CONFIG = {
  shouldBegin: () => true
}

export class NodeDragend extends Extensions.BaseBehavior {
  pointerDown = false

  dragging = false

  selectId = undefined

  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'node:pointerdown': this.onPointerDown,
      pointerup: this.onPointerUp,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onClick() {
    this.clearState()
  }

  onPointerDown(e) {
    if (this.options.shouldBegin(e)) {
      this.pointerDown = true
      this.selectId = e.itemId
    }
  }

  onPointerMove() {
    if (this.pointerDown) {
      this.dragging = true
    }
  }

  onPointerUp(e) {
    if (this.pointerDown && this.dragging) {
      this.dragend(e.canvas.x, e.canvas.y)
      this.clearState()
    }
  }

  clearState() {
    this.dragging = false
    this.pointerDown = false
  }

  dragend(x, y) {
    if (this.selectId === undefined) return
    const nodeModel = this.graph.getNodeData(this.selectId)
    if (nodeModel === undefined) return

    const { id, data } = nodeModel

    const model = {
      id,
      data: { ...data, x: normalX(x), y: normalY(y) }
    }
    setTimeout(async () => {
      // todo 判断是否有重合卡片
      this.graph.updateNodePosition(model, true, true)
    })
  }
}
