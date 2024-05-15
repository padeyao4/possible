import { BaseBehavior, type EventDispatch } from '@/lib/base'
import type { Node, Point } from '@/stores/projects'

export class DragCard extends BaseBehavior {
  getEventDispatch(): EventDispatch {
    return {
      'node:mousedown': this.onmousedown.bind(this),
      ':mouseup': this.onmouseup.bind(this),
      ':mousemove': this.onmousemove.bind(this)
    }
  }

  isDown = false

  mousePosition: Point = { x: 0, y: 0 }

  oldNode = {} as Node

  onmousedown(e: MouseEvent, el: Element) {
    if (this.isDown || e.button !== 0) return
    const nodeId = el.getAttribute('data-key')
    const node = this.project.nodeMap.get(nodeId)
    Object.assign(this.oldNode, node)
    this.isDown = true
    this.mousePosition.x = e.x
    this.mousePosition.y = e.y
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return
    const dx = e.x - this.mousePosition.x
    const dy = e.y - this.mousePosition.y
    const node = this.project.nodeMap.get(this.oldNode.id)
    node.x = this.oldNode.x + dx / this.settings.unitWidth
    node.y = this.oldNode.y + dy / this.settings.unitHeight
    this.mouseStyle.lockStyle('move')
  }

  onmouseup(e: MouseEvent) {
    if (this.isDown) {
      this.isDown = false
      const node = this.project.nodeMap.get(this.oldNode.id)
      node.x = Math.round(node.x)
      node.y = Math.round(node.y)
      this.mouseStyle.unlock()
      this.toggleMouseOver(e)
    }
  }
}
