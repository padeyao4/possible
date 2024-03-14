import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/utils/position-util.js'
import { v4 } from 'uuid'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}
export default class CreateNode extends Extensions.BaseBehavior {

  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'canvas:dblclick': this.create
    }
  }

  create(e) {
    if (!this.options.shouldBegin(e)) return

    const { x, y } = e.canvas
    this.graph.addData('node', {
      id: v4(),
      data: {
        name: 'hello',
        x: normalX(x),
        y: normalY(y),
        detail: '',
        completed: false,
        hover: false
      }
    })
  }
}