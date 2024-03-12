import { Extensions } from '@antv/g6'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

export default class CreateEdge extends Extensions.BaseBehavior {
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
    console.log(e)
  }

  onPointerUp(e) {

  }

  onPointerMove(e) {

  }

  onClick(e) {

  }
}