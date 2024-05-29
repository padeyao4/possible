import { BaseBehavior, type EventDispatch } from '@/lib/base'
import $bus from '@/lib/bus'

export class HandleContextmenu extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'canvas:contextmenu': this.onCanvasContextmenu.bind(this),
      'node:contextmenu': this.onNodeContextmenu.bind(this),
      'edge:contextmenu': this.onEdgeContextmenu.bind(this)
    }
  }

  onNodeContextmenu(e: MouseEvent) {
    this.process(e, 'node')
  }

  onCanvasContextmenu(e: MouseEvent) {
    this.process(e, 'canvas')
  }

  onEdgeContextmenu(e: MouseEvent) {
    this.process(e, 'edge')
  }

  private process(e: MouseEvent, elementType: 'node' | 'canvas' | 'edge') {
    $bus.emit('contextmenu', { e, elementType })
  }
}
