import { Extensions, IG6GraphEvent, ID } from '@antv/g6'
import { plainToInstance } from 'class-transformer'
import { PNode } from '@renderer/model'

export class NodeDragEnd extends Extensions.BaseBehavior {
  private pointerDown = false

  private dragging = false

  private selectId: ID

  getEvents(): { [p: string]: (event: IG6GraphEvent) => void } {
    return {
      'node:pointerdown': this.onPointerDown,
      pointerup: this.onPointerUp,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onClick() {
    this.clearState()
  }

  onPointerDown(e: IG6GraphEvent) {
    if (e.button === 0 && !e.shiftKey) {
      this.pointerDown = true
      this.selectId = e.itemId
    }
  }

  onPointerMove() {
    if (this.pointerDown) {
      this.dragging = true
    }
  }

  onPointerUp(e: IG6GraphEvent) {
    if (this.pointerDown && this.dragging) {
      this.dragend(e.canvas.x, e.canvas.y)
      this.clearState()
    }
  }

  private clearState() {
    this.dragging = false
    this.pointerDown = false
  }

  dragend(x: number, y: number) {
    if (this.selectId === undefined) return
    const nodeModel = this.graph.getNodeData(this.selectId)
    if (nodeModel === undefined) return
    const { data } = nodeModel
    const node = plainToInstance(PNode, data).normalXY(x, y)
    setTimeout(() => {
      // todo 判断是否有重合卡片
      this.graph.updateNodePosition(node.toGraphNode(), true, true)
    })
  }
}
