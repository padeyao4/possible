import { Extensions } from '@antv/g6'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event:any) => event.button === 0
}

export class DragCanvas extends Extensions.BaseBehavior {
  pointerDownPosition = null


  constructor(options:any) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'canvas:pointerdown': this.onPointerDown,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onPointerDown(e) {
    if (!this.options.shouldBegin(e)) return
    const { x, y } = e.client
    this.pointerDownPosition = { x, y }

    const removePointerUpListener = () => {
      this.onPointerUp()
      // 有些情况下导致无法只监听一次,需手动添加移除
      window.removeEventListener('mouseup', removePointerUpListener)
    }

    window.addEventListener('mouseup', removePointerUpListener, { once: true })
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