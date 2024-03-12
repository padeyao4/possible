import { Extensions } from '@antv/g6'
import { v4 } from 'uuid'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

const DUMMY_ID = 'DUMMY_ID'

export default class CreateEdge extends Extensions.BaseBehavior {

  pointDown = false
  edge = {}
  dummyNode = {}

  constructor(options) {
    super(Object.assign({}, DEFAULT_CONFIG, options))
  }

  getEvents() {
    return {
      'node:pointerdown': this.onPointerDown,
      pointerup: this.onPointerUp,
      pointermove: this.onPointerMove,
      click: this.onClick
    }
  }

  onPointerDown(e) {
    if (!this.options.shouldBegin(e)) return
    const { itemId, target: { id } } = e
    if (id !== 'left-dot' && id !== 'right-dot') return
    this.pointDown = true
    this.dummyNode = this.graph.addData('node', {
      id: DUMMY_ID,
      data: {
        type: 'circle-node',
        x: e.canvas.x,
        y: e.canvas.y,
        anchorPoints: [[0.5, 0.5]]
      }
    })
    this.graph.hideItem(this.dummyNode.id)

    this.edge = this.graph.addData('edge', {
      id: v4(),
      source: id === 'right-dot' ? itemId : DUMMY_ID,
      target: id === 'left-dot' ? itemId : DUMMY_ID,
      data: {
        sourceAnchor: 1,
        targetAnchor: 0
      }
    })
  }

  onPointerUp(e) {
    if (!this.pointDown) return
    const { itemId, itemType } = e
    if (itemType === 'node') {
      this.graph.addData('edge', {
        id: v4(),
        source: this.edge.source === DUMMY_ID ? itemId : this.edge.source,
        target: this.edge.target === DUMMY_ID ? itemId : this.edge.target,
        data: {
          sourceAnchor: 1,
          targetAnchor: 0
        }
      })
    }
    this.clearStatus()
  }

  onPointerMove(e) {
    if (!this.pointDown) return
    const { x, y } = e.canvas
    this.graph.updateNodePosition({
      id: this.dummyNode.id, data: {
        x, y
      }
    }, true, true)
  }

  clearStatus() {
    if (!this.pointDown) return
    this.graph.removeData('edge', this.edge.id)
    this.graph.removeData('node', this.dummyNode.id)
    this.dummyNode = null
    this.pointDown = false
  }

  onClick() {
    this.clearStatus()
  }
}