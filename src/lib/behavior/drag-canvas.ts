import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'

export class DragCanvas extends BaseBehavior {
  isDown = false

  position = { x: 0, y: 0 }

  offset = { x: 0, y: 0 }

  project = currentProject()

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return
    const dx = e.x - this.position.x
    const dy = e.y - this.position.y
    this.project.offset.x = this.offset.x + dx
    this.project.offset.y = this.offset.y + dy
  }

  onmousedown(e: MouseEvent) {
    if (this.isDown || (e.target as Element).tagName !== 'svg') return
    this.isDown = true
    this.position.x = e.x
    this.position.y = e.y
    const { x, y } = this.project.offset
    this.offset.x = x
    this.offset.y = y
  }

  onmouseup(e: MouseEvent): void {
    if (this.isDown) {
      this.isDown = false
    }
  }
}