import { BaseBehavior, type EventDispatch } from '@/lib/base'
import { useCanvas } from '@/stores/canvas'
import { useCanvasContextMenu } from '@/stores/contextmenu-store'
import { useMouseStyle } from '@/stores/mouse'
import { clampMax } from '../math'

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

    setTimeout(() => {
      const svg = canvas.svg.getBoundingClientRect()
      contextmenu.clientX = clampMax(e.x, svg.right - contextmenu.bounding.width)
      contextmenu.clientY = clampMax(e.y, svg.bottom - contextmenu.bounding.height)
      const mouseStyle = useMouseStyle()
      mouseStyle.setStyleWithUnlock('default')
    })
  }
}