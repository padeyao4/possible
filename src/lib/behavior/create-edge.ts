import { BaseBehavior, type EventDispatch } from '@/lib/base'
import { getCanvasPointByOffsetPoint } from '@/lib/util'
import { useProjects, type ID } from '@/stores/projects'
import { useTempPaths, type TempPath } from '@/stores/temp-path'

export class CreateEdge extends BaseBehavior {
  isDown = false
  source: string
  target: string
  tempPaths = useTempPaths()
  pathId: ID

  getEventDispatch(): EventDispatch {
    return {
      'anchor:mousedown': this.onmousedown.bind(this),
      ':mousemove': this.onmousemove.bind(this),
      ':mouseup': this.onmouseup.bind(this)
    }
  }

  onmousedown(e: MouseEvent, el: Element) {
    if (e.button !== 0) return
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
      this.mouseStyle.lockStyle('crosshair')
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

  onmouseup(e: MouseEvent, el: Element, __, elType: string) {
    if (this.isDown) {
      const point = getCanvasPointByOffsetPoint({ x: e.offsetX, y: e.offsetY }, this.project)
      const path = this.tempPaths.getPath(this.pathId)
      path.location.x = point.x
      path.location.y = point.y
      this.isDown = false
      this.mouseStyle.unlock()
      this.toggleMouseOver(e)
      this.createEdge(el, elType, path)
      this.tempPaths.deletePath(this.pathId)
    }
  }

  private createEdge(el: Element, elType: string, path: TempPath) {
    if (elType === 'node' || elType === 'anchor') {
      const key = el.getAttribute('data-key')
      if (key == path.nodeId) return
      path.opacity = 0
      if (path.dummy === 'source') {
        useProjects().addEdge(this.project, { id: path.nodeId }, { id: key })
      } else {
        useProjects().addEdge(this.project, { id: key }, { id: path.nodeId })
      }
    }
  }
}
