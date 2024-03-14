import { Extensions } from '@antv/g6'

export class HoverNode extends Extensions.BaseBehavior {
  getEvents() {
    return {
      'node:pointerenter': this.onPointerEnter,
      'node:pointerleave': this.onPointerLeave
    }
  }

  onPointerEnter(e) {
    this.graph.setItemState(e.itemId, 'hover', true)
  }

  onPointerLeave(e) {
    this.graph.setItemState(e.itemId, 'hover', false)
  }

}