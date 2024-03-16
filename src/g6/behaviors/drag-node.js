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

  test(e) {
    console.log('windows test', e)
  }

  getEvents() {
    return {
      'node:pointerdown': this.onPointerDown,
      // pointerup: this.onPointerUp,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onPointerDown(e) {
    if (!this.options.shouldBegin(e)) return

    // 解决鼠标拖出画布无法监听事件
    const self = this
    window.addEventListener('mouseup', function() {
      self.onPointerUp()
      window.removeEventListener('mouseup', this)
    }, { once: true })

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

  /**
   * 拖动结束后逻辑
   * 判断是否能拖动节点
   */
  dragend() {
    const { x, y } = this.graph.getNodeData(this.selectId).data

    const dx = x - this.downPoint.x
    const dy = y - this.downPoint.y

    const nextX = normalX(this.originPoint.x + dx)
    const nextY = normalY(this.originPoint.y + dy)

    if (this.graph.checkNodeOverlap(nextX, nextY)) {
      this.updateNodePosition(this.originPoint.x, this.originPoint.y)
      return
    }

    const delta = nextX - this.originPoint.x

    if (delta > 0) {
      const outBound = this.graph.getSuccessors(this.selectId)
        .map(model => model.data.x)
        .some(x => nextX >= x)
      if (outBound) {
        this.updateNodePosition(this.originPoint.x, this.originPoint.y)
        return
      }
    }

    if (delta < 0) {
      const outBound = this.graph.getPredecessors(this.selectId)
        .map(model => model.data.x)
        .some(x => nextX <= x)
      if (outBound) {
        this.updateNodePosition(this.originPoint.x, this.originPoint.y)
        return
      }
    }

    this.updateNodePosition(nextX, nextY)
  }

  updateNodePosition(x, y) {
    this.graph.updateNodePosition({
      id: this.selectId,
      data: {
        x, y
      }
    }, true, true)
  }

  onPointerUp() {
    if (!this.pointerDown) return
    this.dragend()
    this.clearState()
  }

  onClick() {
    this.clearState()
  }
}