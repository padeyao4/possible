import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/utils/position-util.js'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

export class DragNode extends Extensions.BaseBehavior {
  pointerDown = false

  originPoint = { x: 0, y: 0 }

  downPoint = { x: 0, y: 0 }

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

  onPointerDown(e) {
    if (!this.options.shouldBegin(e)) return
    const { itemId, target: { id } } = e
    if (id === 'anchorShape0' || id === 'anchorShape1') return
    this.selectId = itemId
    this.pointerDown = true
    const { data: { x, y } } = this.graph.getNodeData(this.selectId)
    this.originPoint = { x, y }
    this.downPoint = { x: e.canvas.x, y: e.canvas.y }
  }

  onPointerMove(e) {
    if (!this.pointerDown) return
    const { x, y } = e.canvas

    const dx = x - this.downPoint.x
    const dy = y - this.downPoint.y

    this.graph.updateNodePosition({
      id: this.selectId,
      data: {
        x: this.originPoint.x + dx,
        y: this.originPoint.y + dy
      }
    }, true, true)
  }

  clearState() {
    this.pointerDown = false
    this.selectId = undefined
  }

  dragend(e) {
    const { x, y } = e.canvas

    const dx = x - this.downPoint.x
    const dy = y - this.downPoint.y

    this.graph.updateNodePosition({
      id: this.selectId,
      data: {
        x: normalX(this.originPoint.x + dx),
        y: normalY(this.originPoint.y + dy)
      }
    }, true, true)
  }

  onPointerUp(e) {
    if (!this.pointerDown) return
    this.dragend(e)
    this.clearState()
  }

  onClick() {
    this.clearState()
  }

}