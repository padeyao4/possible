import { BaseBehavior } from '@/lib/base'
import { currentProject } from '@/stores/service/project-service'
import { useSettings } from '@/stores/settings'
import { type Node } from '@/stores/state'
import { campMin } from '@/lib/math'

export class ResizeCard extends BaseBehavior {
  settings = useSettings()
  project = currentProject()
  isPressed = false
  mousePoint = { x: 0, y: 0 }
  oldNode = {} as any
  direction = ''

  onmouseover(e: MouseEvent) {
    if (this.isPressed) return
    this.changeCursorStyle(e)
  }

  private changeCursorStyle(e: MouseEvent) {
    const el = e.target as Element
    if (el.hasAttribute('data-direction')) {
      const direction = el.getAttribute('data-direction')
      this.setMouseStyle(direction)
    } else {
      this.setMouseStyle('none')
    }
  }

  onmousedown(e: MouseEvent) {
    if (this.isPressed) return
    const el = e.target as Element
    if (el.hasAttribute('data-direction')) {
      console.log('resize down')
      this.isPressed = true
      this.direction = el.getAttribute('data-direction')
      this.mousePoint.x = e.x
      this.mousePoint.y = e.y
      const key = el.getAttribute('data-key')
      const node = this.project.nodeMap.get(key)
      Object.assign(this.oldNode, node)
    }
  }

  onmousemove(e: MouseEvent) {
    if (this.isPressed) {
      const dx = e.x - this.mousePoint.x
      const dy = e.y - this.mousePoint.y
      const node = this.project.nodeMap.get(this.oldNode.id)
      this.changeSize(dx, dy, node)
    }
  }

  onmouseup(e: MouseEvent) {
    if (this.isPressed) {
      this.isPressed = false
      const node = this.project.nodeMap.get(this.oldNode.id)
      node.width = Math.round(node.width)
      node.height = Math.round(node.height)
      node.x = Math.round(node.x)
      node.y = Math.round(node.y)
      this.changeCursorStyle(e)
    }
  }

  changeSize(dx: number, dy: number, node: Node) {
    const deltaWidth = dx / this.settings.unitWidth
    const deltaHeight = dy / this.settings.unitHeight
    const rw = campMin(this.oldNode.width + deltaWidth, 1)
    const lw = campMin(this.oldNode.width - deltaWidth, 1)
    const bh = campMin(this.oldNode.height + deltaHeight, 1)
    const th = campMin(this.oldNode.height - deltaHeight, 1)
    const x = this.oldNode.x + (lw === 1 ? (this.oldNode.width - 1) : deltaWidth)
    const y = this.oldNode.y + (th === 1 ? (this.oldNode.height - 1) : deltaHeight)

    switch (this.direction) {
      case 'l':
        node.width = lw
        node.x = x
        break
      case 'r':
        node.width = rw
        break
      case 't':
        node.height = th
        node.y = y
        break
      case 'b':
        node.height = bh
        break
      case 'lt':
        node.width = lw
        node.height = th
        node.x = x
        node.y = y
        break
      case 'rb':
        node.width = rw
        node.height = bh
        break
      case 'rt':
        node.width = rw
        node.height = th
        node.y = y
        break
      case 'lb':
        node.width = lw
        node.height = bh
        node.x = x
        break
      default:
        break
    }
  }

  setMouseStyle(stats: string = 'none') {
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