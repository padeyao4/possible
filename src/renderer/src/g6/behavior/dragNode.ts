import { Extensions, ID, IG6GraphEvent } from '@antv/g6'
import { plainToInstance } from 'class-transformer'
import { PNode } from '@renderer/model'

interface NodeDragEndOptions {
  shouldBegin?: (event: IG6GraphEvent) => boolean
}

const DEFAULT_CONFIG: NodeDragEndOptions = {
  shouldBegin: () => true
}

export class NodeDragEnd extends Extensions.BaseBehavior {
  private pointerDown = false

  private dragging = false

  private selectId: ID

  constructor(options: any) {
    const finalOptions = Object.assign({}, options, DEFAULT_CONFIG)
    super(finalOptions)
  }

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
    if (this.options.shouldBegin(e)) {
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
