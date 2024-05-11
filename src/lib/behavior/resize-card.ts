import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'
import { useSettings } from '@/stores/settings'
import { getDirection, isPointInRectangle } from '@/lib/math'

interface BoundingRect {
  x: number,
  y: number,
  width: number,
  height: number,
  top: number,
  left: number,
  right: number,
  bottom: number
}

export class ResizeCard extends BaseBehavior {
  settings = useSettings()
  project = currentProject()
  isRect = false

  onmouseover(e: MouseEvent) {
    const el = e.target as Element
    if (el.hasAttribute('data-direction')) {
      const direction = el.getAttribute('data-direction')
      console.log(direction)
      this.setMouseStyle(direction)
    }else{
      this.setMouseStyle('none')
    }
  }

  setMouseStyle(stats: string) {
    switch (stats) {
      case 'l':
      case 'r':
        document.body.style.cursor = 'w-resize'
        break
      case 't':
      case 'b':
        document.body.style.cursor = 's-resize'
        break
      case 'lt':
      case 'rb': {
        document.body.style.cursor = 'nw-resize'
        break
      }
      case 'rt':
      case 'lb':
        document.body.style.cursor = 'ne-resize'
        break
      case 'none':
        document.body.style.cursor = 'default'
        break
      default:
        document.body.style.cursor = 'default'
    }
  }

}