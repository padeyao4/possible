import { Extensions, type ID, type IG6GraphEvent } from '@antv/g6'
import { v4 } from 'uuid'
import { useStore } from '@/stores/store'
import { useRoute } from 'vue-router'

interface DefaultOption {
  shouldBegin: (event: any) => boolean;

  [key: string]: any
}

const DEFAULT_CONFIG = {
  /**
   * Checks if the mouse button pressed to start dragging is the primary button.
   *
   * @param event - The mouse event.
   * @returns True if the primary button was pressed.
   */
  shouldBegin: (event: any) => event.button === 0
}

const DUMMY_ID = 'DUMMY_NODE'

export default class CreateEdge extends Extensions.BaseBehavior {

  store = useStore()
  route = useRoute()
  currentProject = this.store.projects[this.route.params.id as string]

  pointDown = false

  edge: {
    id: ID,
    source: ID,
    target: ID,
    data: any
  }

  constructor(options: Partial<DefaultOption>) {
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

  onPointerDown(e: IG6GraphEvent) {
    if (!this.options.shouldBegin(e)) return
    const itemId = e.itemId
    const id = (e.target as any).id
    if (id !== 'anchorShape0' && id !== 'anchorShape1') return
    this.pointDown = true

    this.graph.addData('node', {
      id: DUMMY_ID,
      data: {
        name: 'dummy',
        type: 'circle-node',
        x: e.canvas.x,
        y: e.canvas.y,
        anchorPoints: [[0.5, 0.5]]
      }
    })

    this.graph.hideItem(DUMMY_ID)

    const sourceId = id === 'anchorShape1' ? itemId : DUMMY_ID
    const targetId = id === 'anchorShape0' ? itemId : DUMMY_ID

    this.edge = {
      id: 'DUMMY_EDGE',
      source: sourceId,
      target: targetId,
      data: {
        sourceAnchor: 1,
        targetAnchor: 0
      }
    }
    this.graph.addData('edge', { ...this.edge })
  }

  creteEdge(sourceId: ID, targetId: ID) {
    const source = this.graph.getNodeData(sourceId)
    const target = this.graph.getNodeData(targetId)
    if (source.data.x >= target.data.x) return
    if (sourceId === targetId) return

    const isInclude = this.graph.getNeighborNodesData(sourceId, 'both')
      .map(model => model.id)
      .includes(targetId)
    if (isInclude) return

    this.store.addEdge({
      id: v4(),
      source: sourceId,
      target: targetId,
      data: {
        sourceAnchor: 1,
        targetAnchor: 0
      }
    }, this.currentProject)
  }

  onPointerUp(e: IG6GraphEvent) {
    if (!this.pointDown) return
    this.clearStatus()
    const { itemId, itemType } = e
    const sourceId = this.edge.source === DUMMY_ID ? itemId : this.edge.source
    const targetId = this.edge.target === DUMMY_ID ? itemId : this.edge.target

    if (itemType !== 'node') {
      return
    }

    const model = this.graph.getNodeData(targetId)
    if (model.data.completed) {
      return
    }

    this.creteEdge(sourceId, targetId)
  }

  onPointerMove(e: IG6GraphEvent) {
    if (!this.pointDown) return
    const { x, y } = e.canvas
    this.graph.updateNodePosition({
      id: DUMMY_ID, data: {
        x, y
      }
    })
  }

  clearStatus() {
    if (!this.pointDown) return
    this.graph.removeData('node', DUMMY_ID)
    this.pointDown = false
  }

  onClick() {
    this.clearStatus()
  }
}