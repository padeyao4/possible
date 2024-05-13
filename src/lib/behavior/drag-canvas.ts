import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'
import { campMax, campMin } from '@/lib/math'
import { changeMouseStyle, lockMouseStyle, unlockMouseStyle } from '@/stores/mouse'

export class DragCanvas extends BaseBehavior {
  isDown = false

  position = { x: 0, y: 0 }

  offset = { x: 0, y: 0 }

  project = currentProject()

  onmouseover(e: MouseEvent) {
    const el = e.target as Element
    if (el.getAttribute('data-type') === 'canvas') {
      changeMouseStyle('default')
    }
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return
    const dx = e.x - this.position.x
    const dy = e.y - this.position.y
    this.project.offset.x = campMax(this.offset.x + dx, 0)
    this.project.offset.y = campMax(this.offset.y + dy, 0)
  }

  onmousedown(e: MouseEvent) {
    const el = e.target as Element
    if (this.isDown || el.tagName !== 'svg' || e.button !== 0) return
    this.isDown = true
    this.position.x = e.x
    this.position.y = e.y
    const { x, y } = this.project.offset
    this.offset.x = x
    this.offset.y = y
    lockMouseStyle('grabbing')
  }

  onmouseout(e: MouseEvent) {
    const el = e.target as Element
    if (el.getAttribute('data-type') === 'canvas') {
      changeMouseStyle('default')
    }
  }

  onmouseup(e: MouseEvent): void {
    if (this.isDown) {
      this.isDown = false
      unlockMouseStyle()
      this.onmouseover(e)
    }
  }
}