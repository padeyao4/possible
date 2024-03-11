import { Extensions } from '@antv/g6'
import { normalX, normalY } from '@/g6/utils/position-util.js'

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
      id: 'node-' + Math.random().toString(),
      data: {
        name: 'hello',
        x: normalX(x),
        y: normalY(y)
      }
    })
  }
}