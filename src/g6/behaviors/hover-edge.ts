import { Extensions, type IG6GraphEvent } from '@antv/g6'

export class HoverEdge extends Extensions.BaseBehavior {
  getEvents() {
    return {
      'edge:pointerenter': this.onPointerEnter,
      'edge:pointerleave': this.onPointerLeave
    }
  }

  onPointerEnter(e: IG6GraphEvent) {
    this.graph.setItemState(e.itemId, 'hover', true)
  }

  onPointerLeave(e: IG6GraphEvent) {
    this.graph.setItemState(e.itemId, 'hover', false)
  }

}