import { BaseBehavior, type EventDispatch } from '@/lib/base'
import { useCanvasContextMenu } from '@/stores/canvas-contextmenu'
import { useCanvas } from '@/stores/canvas'

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
    const contextmenu = useCanvasContextMenu()
    const canvas = useCanvas()

    contextmenu.setActive(elementType)
    contextmenu.mouseEvent = e
    contextmenu.visible = true

    const rect1 = contextmenu.element.getBoundingClientRect()
    const rect2 = canvas.svg.getBoundingClientRect()

    if (e.x + rect1.width > rect2.right) {
      contextmenu.clientX = (e.x - rect1.width)
    } else {
      contextmenu.clientX = e.x
    }
    if (e.y + rect1.height > rect2.bottom) {
      contextmenu.clientY = rect2.bottom - rect1.height
    } else {
      contextmenu.clientY = e.y
    }
  }
}