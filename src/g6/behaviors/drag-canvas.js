import { Extensions } from '@antv/g6'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

export class DragCanvas extends Extensions.BaseBehavior {
  pointerDownPosition = null


  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'canvas:pointerdown': this.onPointerDown,
      pointerup: this.onPointerUp,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onPointerDown(e) {
    if (!this.options.shouldBegin(e)) return
    const { x, y } = e.client
    this.pointerDownPosition = { x, y }
  }

  onPointerMove(e) {
    if (!this.pointerDownPosition) return
    const { x, y } = e.client
    const dx = x - this.pointerDownPosition.x
    const dy = y - this.pointerDownPosition.y
    this.graph.translate({ dx, dy }).then(() => {
    })
    this.pointerDownPosition = { x, y }
  }

  onPointerUp() {
    if (!this.pointerDownPosition) return
    this.clearState()
  }

  onClick() {
    this.clearState()
  }

  clearState() {
    this.pointerDownPosition = null
  }
}