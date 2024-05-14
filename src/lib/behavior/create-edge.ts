import { BaseBehavior } from '@/lib/base'
import { type TempPath, useTempPaths } from '@/stores/temp-path'
import type { ID } from '@/stores/projects'
import { getCanvasPointByOffsetPoint } from '@/lib/util'
import { addEdge, currentProject } from '@/stores/service/project-service'
import { lockMouseStyle, unlockMouseStyle } from '@/stores/mouse'

export class CreateEdge extends BaseBehavior {
  isOver = false
  isDown = false
  group: Element
  source: string
  target: string
  tempPaths = useTempPaths()
  pathId: ID
  project = currentProject()

  onmouseover(e: MouseEvent) {
    const el = e.target as Element
    if (el.getAttribute('data-type') === 'node') {
      this.isOver = true
      const id = el.getAttribute('data-key')
      const group = document.getElementById('anchor-' + id)
      group?.setAttribute('opacity', '1')
      this.group = group
    }
  }

  onmouseout(e: MouseEvent) {
    if (this.isOver) {
      this.isOver = false
      this.group?.setAttribute('opacity', '0')
    }
  }

  onmousedown(e: MouseEvent) {
    const el = e.target as Element
    if (el.hasAttribute('data-anchor')) {
      this.isDown = true
      const key = el.getAttribute('data-key')
      const direction = el.getAttribute('data-anchor')
      const point = getCanvasPointByOffsetPoint({ x: e.offsetX, y: e.offsetY }, this.project)
      const path = this.tempPaths.createTempPath(
        key,
        point,
        direction === 'left' ? 'target' : 'source'
      )
      this.pathId = path.id
      lockMouseStyle('crosshair')
    }
  }

  onmousemove(e: MouseEvent) {
    if (this.isDown) {
      this.updatePoint(e)
    }
  }

  private updatePoint(e: MouseEvent) {
    const point = getCanvasPointByOffsetPoint({ x: e.offsetX, y: e.offsetY }, this.project)
    const path = this.tempPaths.getPath(this.pathId)
    path.location.x = point.x
    path.location.y = point.y
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      const point = getCanvasPointByOffsetPoint({ x: e.offsetX, y: e.offsetY }, this.project)
      const path = this.tempPaths.getPath(this.pathId)
      path.location.x = point.x
      path.location.y = point.y
      this.isDown = false
      unlockMouseStyle()
      this.toggleMouseOver(e)
      this.createEdge(e, path)
      this.tempPaths.deletePath(this.pathId)
    }
  }

  private createEdge(e: MouseEvent, path: TempPath) {
    const el = e.target as Element
    if (el.getAttribute('data-type') === 'node') {
      const key = el.getAttribute('data-key')
      if (key == path.nodeId) return
      path.opacity = 0
      if (path.dummy === 'source') {
        addEdge(this.project, { id: path.nodeId }, { id: key })
      } else {
        addEdge(this.project, { id: key }, { id: path.nodeId })
      }
    }
  }
}