import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/utils/position-util.js'
import { v4 } from 'uuid'

export default class CreateNode extends Extensions.BaseBehavior {
  getEvents() {
    return {
      'canvas:dblclick': this.create
    }
  }

  create(e) {
    // 鼠标左键 e.button 0 为鼠标左键
    if (e.button !== 0) return
    const { x, y } = e.canvas
    this.graph.addData('node', {
      id: v4(),
      data: {
        name: 'hello',
        x: normalX(x),
        y: normalY(y)
      }
    })
  }
}