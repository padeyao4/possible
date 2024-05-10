import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'
import type { Point, Project, Node } from '@/stores/state'
import { useSettings } from '@/stores/settings'

export class DragCard extends BaseBehavior {
  isDown = false

  mousePosition: Point

  oldNode: Node

  project: Project

  settings = useSettings()

  constructor() {
    super()
    this.project = currentProject()
    this.oldNode = {} as Node
    this.mousePosition = { x: 0, y: 0 }
  }

  onmousemove(e: MouseEvent) {
    if (!this.isDown) return
    const dx = e.x - this.mousePosition.x
    const dy = e.y - this.mousePosition.y
    const node = this.project.nodeMap.get(this.oldNode.id)
    node.x = this.oldNode.x + dx / this.settings.unitWidth
    node.y = this.oldNode.y + dy / this.settings.unitHeight
  }

  onmousedown(e: MouseEvent) {
    const el = e.target as Element
    if (this.isDown || el.tagName !== 'rect') return
    const nodeId = el.getAttribute('data-key')
    const node = this.project.nodeMap.get(nodeId)
    Object.assign(this.oldNode, node)
    this.isDown = true
    this.mousePosition.x = e.x
    this.mousePosition.y = e.y
  }

  onmouseup(e: MouseEvent): void {
    if (this.isDown) {
      this.isDown = false
      const node = this.project.nodeMap.get(this.oldNode.id)
      node.x = Math.round(node.x)
      node.y = Math.round(node.y)
    }
  }
}