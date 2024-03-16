import { Extensions } from '@antv/g6'

export class HoverNode extends Extensions.BaseBehavior {
  getEvents() {
    return {
      'node:pointerenter': this.onPointerEnter,
      'node:pointerleave': this.onPointerLeave
    }
  }

  onPointerEnter(e) {
    const id = e.itemId
    if (this.graph.hasNode(id)) {
      this.graph.setItemState(id, 'hover', true)
    }
  }

  onPointerLeave(e) {
    const id = e.itemId
    if (this.graph.hasNode(id)) {
      this.graph.setItemState(id, 'hover', false)
    }
  }

}