import { Extensions, type IG6GraphEvent } from '@antv/g6'
import { normalX, normalY } from '@/utils/position-util.js'
import { useStore } from '@/stores/store'
import { dateToX } from '@/utils/time'
import { useRoute } from 'vue-router'

const DEFAULT_CONFIG = {
  // 鼠标左键生效
  shouldBegin: (event) => event.button === 0
}

export default class DragNode extends Extensions.BaseBehavior {
  pointerDown = false

  dragging = false

  pointerDownPosition = {
    x: 0, y: 0
  }

  originNodeData = {
    id: '',
    data: {
      x: 0,
      y: 0,
      completed: false
    }
  }

  store = useStore()
  route = useRoute()
  currentProject = this.store.projects[this.route.params.id as string]

  currentX = 0

  constructor(options: any) {
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

    // 解决鼠标拖出画布无法监听事件
    const removeListener = () => {
      this.onPointerUp()
      window.removeEventListener('mouseup', removeListener)
    }

    window.addEventListener('mouseup', removeListener, { once: true })

    const { itemId, target: { id } } = e
    if (id === 'anchorShape0' || id === 'anchorShape1') return

    const model = this.graph.getNodeData(itemId)
    this.originNodeData = {
      id: itemId,
      data: {
        x: model.data.x,
        y: model.data.y,
        completed: model.data.completed as boolean
      }
    }
    this.pointerDown = true
    this.pointerDownPosition = { x: e.canvas.x, y: e.canvas.y }

    this.currentX = dateToX(this.store.currentTime, this.currentProject.createTime)
  }

  onPointerMove(e: IG6GraphEvent) {
    if (!this.pointerDown) return

    if (!this.dragging) {
      this.dragging = true
    }

    const { x, y } = this.originNodeData.data

    const dstX = x - this.pointerDownPosition.x + e.canvas.x
    const dstY = y - this.pointerDownPosition.y + e.canvas.y

    this.graph.updateData('node', {
      id: this.originNodeData.id,
      data: {
        x: dstX,
        y: dstY,
        completed: normalX(dstX) < this.currentX || this.originNodeData.data.completed
      }
    })
  }

  clearState() {
    this.pointerDown = false
    this.dragging = false
  }

  /**
   * 拖动结束后逻辑
   * 判断是否能拖动节点
   */
  dragend() {
    const nodeId = this.originNodeData.id
    const { x, y } = this.graph.getNodeData(nodeId).data

    const nextX = normalX(x)
    const nextY = normalY(y)

    if (this.graph.checkNodeOverlap(nextX, nextY)) {
      this.restoreNodeState()
      return
    }

    const dx = x - this.originNodeData.data.x

    if (dx > 0) {
      const outBound = this.graph.getSuccessors(nodeId)
        .map(model => model.data.x)
        .some(x => nextX >= x)
      if (outBound) {
        this.restoreNodeState()
        return
      }
    }

    if (dx < 0) {
      const outBound = this.graph.getPredecessors(nodeId)
        .map(model => model.data.x)
        .some(x => nextX <= x)
      if (outBound) {
        this.restoreNodeState()
        return
      }
    }

    this.updateNodeInfo(nextX, nextY)
  }

  restoreNodeState() {
    this.graph.updateData('node', this.originNodeData)
  }

  updateNodeInfo(x: number, y: number) {
    this.store.updateNode({
      id: this.originNodeData.id,
      data: {
        x, y, completed: x < this.currentX || this.originNodeData.data.completed
      }
    }, this.currentProject)
  }

  onPointerUp() {
    if (!this.pointerDown) return
    if (!this.dragging) return
    this.clearState()
    this.dragend()
  }

  onClick() {
    this.clearState()
  }
}