import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'

export class DragCanvas extends BaseBehavior {
  isDown = false

  position = { x: 0, y: 0 }

  offset = { x: 0, y: 0 }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return
    const dx = e.x - this.position.x
    const dy = e.y - this.position.y
    const project = currentProject()
    project.offset.x = this.offset.x + dx
    project.offset.y = this.offset.y + dy
  }

  onmousedown(e: MouseEvent) {
    if (this.isDown) return
    this.isDown = true
    this.position.x = e.x
    this.position.y = e.y
    const project = currentProject()
    const { x, y } = project.offset
    this.offset.x = x
    this.offset.y = y
  }

  onmouseup(e: MouseEvent): void {
    if (this.isDown) {
      this.isDown = false
    }
  }
}