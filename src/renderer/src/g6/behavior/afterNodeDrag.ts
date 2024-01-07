import { Extensions, IG6GraphEvent } from '@antv/g6'
import { plainToInstance } from 'class-transformer'
import { PNode } from '@renderer/model'

export class NodeDragEnd extends Extensions.BaseBehavior {
  private pointerDown = false

  private dragging = false

  private selectId = ''

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
      this.selectId = e.itemId as string
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
    const { data } = this.graph.getNodeData(this.selectId)!
    const node = plainToInstance(PNode, data)
    setTimeout(() => {
      // todo 判断是否有重合卡片
      this.graph.updateNodePosition(node.normalXY(x, y).toGraphNode(), true, true)
    })
  }
}
